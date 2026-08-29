/**
 * `class-validator` ships this internal module without type declarations.
 * The library patches `replaceMessageSpecialTokens` to return a structured
 * `{ message, detail }` payload instead of the upstream plain string.
 */
declare module 'class-validator/cjs/validation/ValidationUtils.js' {
    export const ValidationUtils: {
        replaceMessageSpecialTokens: (message: string | ((args: any) => string), validationArguments: any) => any;
    };
}
