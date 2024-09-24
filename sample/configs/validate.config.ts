import { ValidateException } from '@hodfords/nestjs-exception';
import { ValidationPipe } from '@hodfords/nestjs-validation';

export const validateConfig = new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    exceptionFactory: (errors): ValidateException => new ValidateException(errors)
});
