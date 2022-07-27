interface Tag {
  id: number;
  name: string;
}

export interface PictureInterface {
  id: number;
  width: number;
  height: number;
  size: number;
  link: string;
  url: string;
  header: string;
  previewName: string;
  previewAlt: string;
  previewTitle: string;
  previewWidth: number;
  previewHeight: number;
  previewLink: string;
  mime: string;
  created: Date;
  views: number;
  downloads: number;
  tags: Tag[];
}
