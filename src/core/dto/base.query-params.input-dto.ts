import { Type } from 'class-transformer';
import { SortDirection } from '../enums/sort-direction.enum';

export class BaseQueryParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
  sortDirection: SortDirection = SortDirection.Desc;
  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
