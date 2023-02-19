import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import { EnvironmentVariables } from '../../env.validation';

@Injectable()
export class YandexDiskService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async upload(subFolder: string, filePath: string): Promise<void> {
    const createSubFolder = await lastValueFrom(
      this.httpService.request({
        method: 'PUT',
        url: 'https://cloud-api.yandex.net/v1/disk/resources',
        params: { path: subFolder },
        timeout: 180000,
        validateStatus: () => true,
        headers: {
          Authorization: `OAuth ${this.configService.get('YANDEX_DISK_KEY')}`,
        },
      }),
    );

    if (createSubFolder.status !== 201 && createSubFolder.status !== 409) {
      throw new Error(createSubFolder.data.description);
    }

    const linkForFileUpload = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: 'https://cloud-api.yandex.net/v1/disk/resources/upload',
        params: { path: `${subFolder}/${path.basename(filePath)}` },
        timeout: 180000,
        validateStatus: () => true,
        headers: {
          Authorization: `OAuth ${this.configService.get('YANDEX_DISK_KEY')}`,
        },
      }),
    );

    if (linkForFileUpload.status !== 200) {
      throw new Error(linkForFileUpload.data.description);
    }

    if (linkForFileUpload.data.templated) {
      throw new Error('Templated href');
    }

    const uploadFile = await lastValueFrom(
      this.httpService.request({
        method: 'PUT',
        url: linkForFileUpload.data.href,
        timeout: 180000,
        validateStatus: () => true,
        headers: {
          Authorization: `OAuth ${this.configService.get('YANDEX_DISK_KEY')}`,
        },
        data: await fsPromises.readFile(filePath),
      }),
    );

    if (uploadFile.status !== 201) {
      throw new Error(`Failed to upload file with status ${uploadFile.status}`);
    }
  }

  async download(diskPath: string, downloadPath: string): Promise<void> {
    const downloadlink = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: 'https://cloud-api.yandex.net/v1/disk/resources/download',
        params: { path: diskPath },
        timeout: 180000,
        validateStatus: () => true,
        headers: {
          Authorization: `OAuth ${this.configService.get('YANDEX_DISK_KEY')}`,
        },
      }),
    );

    if (downloadlink.status !== 200) {
      throw new Error(downloadlink.data.description);
    }

    if (downloadlink.data.templated) {
      throw new Error('Templated href');
    }

    const downloading = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: downloadlink.data.href,
        timeout: 180000,
        responseType: 'stream',
        validateStatus: () => true,
      }),
    );

    if (downloading.status !== 200) {
      throw new Error(downloading.data);
    }

    const writer = fs.createWriteStream(downloadPath);
    let error: Error;

    await new Promise((resolve, reject) => {
      downloading.data.pipe(writer);

      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on('close', () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  }
}
