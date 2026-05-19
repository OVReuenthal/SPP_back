import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProyectoMayorDto {
    @IsNotEmpty()
    @IsString()
    elemento_pep: string;
    
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    presupuesto: number;
}