import { IsString, ValidateIf } from 'class-validator';
import { RequestDto } from '../lib/dtos/request.dto';

export class AppDto {
    @IsString()
    stringValue: string;
}

export class AddRequestToBodyDto extends RequestDto {
    @IsString()
    @ValidateIf((dto: AddRequestToBodyDto) => {
        return !!dto.requestDto.params.id;
    })
    stringValue: string;
}
