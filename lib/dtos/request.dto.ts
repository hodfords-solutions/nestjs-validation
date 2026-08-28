import { IsOptional } from 'class-validator';
import { ParentDto } from './parent.dto.js';
import { RequestDtoType } from '../types/request-dto.type.js';

export abstract class RequestDto extends ParentDto {
    @IsOptional()
    protected requestDto?: RequestDtoType;
}
