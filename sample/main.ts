import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { validateConfig } from './configs/validate.config.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(validateConfig);
    await app.listen(3000);
    console.log('App listening on port 3000');
}
bootstrap();
