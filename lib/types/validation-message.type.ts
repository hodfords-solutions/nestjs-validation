import { ValidationArguments } from 'class-validator';

export type ValidationMessage = {
    detail: {
        property: string;
        target: string;
        value: any;
    };
    message: string | ((args: ValidationArguments) => string);
};
