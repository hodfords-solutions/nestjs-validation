import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { i18nConfig } from './configs/i18n.config.js';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@hodfords/nestjs-exception';

@Module({
    imports: [i18nConfig],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}
