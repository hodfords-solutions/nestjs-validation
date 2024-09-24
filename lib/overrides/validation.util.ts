import { ValidationArguments } from 'class-validator';
import { ValidationMessage } from '../types/validation-message.type';

// Ref: https://github.com/typestack/class-validator/blob/develop/src/validation/ValidationUtils.ts

export function constraintToString(constraint: unknown): string {
    if (Array.isArray(constraint)) {
        return constraint.join(', ');
    }
    return `${constraint}`;
}

export class ValidationUtils {
    static replaceMessageSpecialTokens(
        message: string | ((args: ValidationArguments) => string),
        validationArguments: ValidationArguments
    ): ValidationMessage {
        const detail: ValidationMessage['detail'] = {
            property: validationArguments.property,
            target: validationArguments.targetName,
            value: validationArguments.value
        };

        if (validationArguments.constraints instanceof Array) {
            validationArguments.constraints.forEach((constraint, index) => {
                detail[`constraint${index + 1}`] = constraintToString(constraint);
            });
        }

        return { message, detail };
    }
}
