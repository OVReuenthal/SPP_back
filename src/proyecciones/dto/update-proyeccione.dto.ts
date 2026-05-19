import { PartialType } from '@nestjs/mapped-types';
import { CreateProyeccioneDto } from './create-proyeccione.dto';

export class UpdateProyeccioneDto extends PartialType(CreateProyeccioneDto) {}
