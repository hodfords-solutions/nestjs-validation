import { ArgumentMetadata } from '@nestjs/common';
import { IsString } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { RequestDto, ValidationPipe } from '../lib/index.js';

class SampleDto {
    @IsString()
    stringValue: string;
}

class SampleRequestDto extends RequestDto {
    @IsString()
    stringValue: string;
}

const metadata = (metatype: any): ArgumentMetadata => ({ type: 'body', metatype, data: undefined });

describe('ValidationPipe', () => {
    it('passes a valid payload through', async () => {
        const pipe = new ValidationPipe({ transform: true });
        await expect(pipe.transform({ stringValue: 'hello' }, metadata(SampleDto))).resolves.toMatchObject({
            stringValue: 'hello'
        });
    });

    it('throws with the customized error detail on an invalid payload', async () => {
        const pipe = new ValidationPipe({
            transform: true,
            exceptionFactory: (errors) => errors
        });
        const errors: any = await pipe.transform({}, metadata(SampleDto)).catch((error) => error);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('stringValue');
        // `overrides/class-validation` turns constraint strings into { message, detail } objects
        expect(errors[0].constraints.isString).toEqual({
            message: expect.any(String),
            detail: { property: 'stringValue', target: 'SampleDto', value: undefined }
        });
    });

    it('strips requestDto/parentDto helper fields from the result', async () => {
        const pipe = new ValidationPipe({ transform: true });
        const result: any = await pipe.transform({ stringValue: 'hello' }, metadata(SampleRequestDto));

        expect(result).toBeInstanceOf(SampleRequestDto);
        expect(result).not.toHaveProperty('requestDto');
        expect(result).not.toHaveProperty('parentDto');
    });

    it('leaves primitive metatypes untouched', async () => {
        const pipe = new ValidationPipe({ transform: true });
        await expect(pipe.transform('plain', metadata(String))).resolves.toBe('plain');
    });
});
