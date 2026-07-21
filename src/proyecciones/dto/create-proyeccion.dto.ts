import { IsInt, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateProyeccionDto {
  @IsInt()
  @IsNotEmpty()
  id_actividad: number;

  @IsInt()
  @IsNotEmpty()
  id_distribucion: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'mes_inicio must be in YYYY-MM format' })
  mes_inicio: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsInt()
  @IsNotEmpty()
  duracion: number;
}
