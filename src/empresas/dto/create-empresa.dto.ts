import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  codigo_proveedor: string;

  @IsString()
  @IsOptional()
  rif?: string;

  @IsString()
  @IsOptional()
  nombre?: string;
}
