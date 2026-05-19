import { PartialType } from '@nestjs/mapped-types';
import { CreateSelectDto } from './create-select.dto';

export class UpdateSelectDto extends PartialType(CreateSelectDto) {}
