import { ValidateException } from '@hodfords/nestjs-exception';
import { ValidationPipe } from '../../lib/index.js';

export const validateConfig = new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    exceptionFactory: (errors): ValidateException => new ValidateException(errors)
});
