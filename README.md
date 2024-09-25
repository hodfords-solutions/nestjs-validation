<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Hodfords Logo" /></a>
</p>

<p align="center"> <b>nestjs-validation</b> enhances validation in your NestJS projects by providing a customized `ValidationPipe` that returns custom error messages. This library simplifies error handling by offering localized and user-friendly responses

## Installation 🤖

Install the `nestjs-validation` package with:

```bash
npm install @hodfords/nestjs-validation --save
```

## Usage 🚀

First, create an instance of ValidationPipe with the desired configuration:

```typescript
import { ValidationPipe } from '@hodfords/nestjs-validation';
import { ValidateException } from '@hodfords/nestjs-exception';

export const validateConfig = new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
    forbidUnknownValues: false,
    exceptionFactory: (errors): ValidateException => new ValidateException(errors)
});
```

Next, set the validation configuration globally in your bootstrap function:

```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(validateConfig);
    await app.listen(3000);
}
```

### Customize Validation Error

The original error message provides basic information but lacks detail. With **nestjs-validation**, you can enhance these errors by adding meaningful context, such as the field’s property name, value, and target object.

**Original Validation Error**

```javascript
ValidationError {
  target: AppDto { stringValue: undefined },
  value: undefined,
  property: 'stringValue',
  children: [],
  constraints: { isString: 'stringValue must be a string' }
}
```

**Customized Validation Error**

```javascript
ValidationError {
  target: AppDto { stringValue: undefined },
  value: undefined,
  property: 'stringValue',
  children: [],
  constraints: {
    isString: {
      message: '$property must be a string',
      detail: { property: 'stringValue', target: 'AppDto', value: undefined }
    }
  }
}
```

### Exception

When combined with [nestjs-exception](https://www.npmjs.com/package/@hodfords/nestjs-exception), errors are translated into localized messages:

```json
{
    "message": "Validate Exception",
    "errors": {
        "stringValue": {
            "messages": ["String Value phải là một chuỗi kí tự"]
        }
    }
}
```

## License 📝

This project is licensed under the MIT License
