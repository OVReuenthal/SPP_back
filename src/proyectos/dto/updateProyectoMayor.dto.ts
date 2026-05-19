import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoMayorDto } from './createProyectoMayor.dto';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateProyectoMayorDto extends PartialType(CreateProyectoMayorDto) {
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
