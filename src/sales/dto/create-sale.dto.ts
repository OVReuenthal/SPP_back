import { IsInt, Min } from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  user_id: number;
}
