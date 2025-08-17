import { Type } from 'class-transformer';
import { SortDirection } from '../enums/sort-direction.enum';
import { IsEnum, IsInt, Min } from 'class-validator';

export class BaseQueryParams {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number = 1;
  @Type(() => Number)
  @IsInt()
  @Min(10)
  pageSize: number = 10;
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;
  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
