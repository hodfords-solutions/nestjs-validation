import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { AddRequestToBodyDto, AppDto } from './app.dto';
import { AddRequestToBody } from '../lib/decorators/add-request-to-body.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    sayHello(@Body() dto: AppDto): string {
        return dto.stringValue;
    }

    @Put(':id')
    @AddRequestToBody()
    addRequestToBody(@Body() dto: AddRequestToBodyDto): AddRequestToBodyDto {
        return dto;
    }
}
