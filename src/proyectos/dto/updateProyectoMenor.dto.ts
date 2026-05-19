import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoMenorDto } from './createProyectoMenor.dto';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateProyectoMenorDto extends PartialType(CreateProyectoMenorDto) {
    @IsNotEmpty()
    @IsString()
    elemento_pep_secundario: string;
    
    @IsNotEmpty()
    @IsString()
    grafo: string;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    elemento_pep: string;

    @IsNotEmpty()
    @IsNumber()
    presupuesto: number;
}
