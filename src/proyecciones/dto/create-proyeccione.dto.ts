import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProyeccioneDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  elemento_pep_secundario: string;

  @IsString()
  @IsOptional()
  codigo_proveedor?: string;

  @IsInt()
  @IsNotEmpty()
  id_estado: number;

  @IsInt()
  @IsNotEmpty()
  id_clase: number;

  @IsInt()
  @IsNotEmpty()
  id_tipo: number;
}
