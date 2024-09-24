import { IsOptional } from 'class-validator';
import { ParentDto } from './parent.dto';
import { RequestDtoType } from '../types/request-dto.type';

export abstract class RequestDto extends ParentDto {
    @IsOptional()
    protected requestDto?: RequestDtoType;
}
