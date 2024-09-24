import { IsOptional } from 'class-validator';

export abstract class ParentDto {
    @IsOptional()
    protected parentDto: any;
}
