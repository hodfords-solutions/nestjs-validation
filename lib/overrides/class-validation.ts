import { ValidationUtils } from 'class-validator/cjs/validation/ValidationUtils.js';

export function constraintToString(constraint: unknown): string {
    if (Array.isArray(constraint)) {
        return constraint.join(', ');
    }
    return `${constraint}`;
}

ValidationUtils.replaceMessageSpecialTokens = function (
    message: string | ((args: any) => string),
    validationArguments: any
): any {
    const detail: any = {
        property: validationArguments.property,
        target: validationArguments.targetName,
        value: validationArguments.value
    };

    if (validationArguments.constraints instanceof Array) {
        validationArguments.constraints.forEach((constraint: any, index: number) => {
            detail[`constraint${index + 1}`] = constraintToString(constraint);
        });
    }

    return { message, detail };
};
