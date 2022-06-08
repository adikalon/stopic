export class PaginatedInterface {
  limit!: number;
  offset!: number;
  deleted!: boolean;
  search!: string | undefined;
}
