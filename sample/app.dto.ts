import { IsString } from 'class-validator';

export class AppDto {
    @IsString()
    stringValue: string;
}
