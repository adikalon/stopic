import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const configStateKey = makeStateKey<ConfigInterface>('CONFIG');

export interface ConfigInterface {
  appUrl: string | undefined;
}

@Injectable()
export class ConfigService {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly transferState: TransferState,
  ) {
    if (isPlatformServer(this.platformId)) {
      const appUrl = process.env['APP_URL']
        ? process.env['APP_URL'].replace(/\/$/, '')
        : undefined;

      this.transferState.set<ConfigInterface>(configStateKey, { appUrl });
    }
  }

  async getConfig(): Promise<ConfigInterface> {
    return this.transferState.get<ConfigInterface>(configStateKey, {
      appUrl: undefined,
    });
  }
}
