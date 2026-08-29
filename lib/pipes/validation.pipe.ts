import {
    ArgumentMetadata,
    Injectable,
    Optional,
    ValidationPipe as BaseValidationPipe,
    ValidationPipeOptions
} from '@nestjs/common';
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface.js';
import { ValidatorPackage } from '@nestjs/common/interfaces/external/validator-package.interface.js';
import { isObject } from '@nestjs/common/utils/shared.utils.js';
import { ParentDto } from '../dtos/parent.dto.js';
import { RequestDto } from '../dtos/request.dto.js';
import { TRANSFORMER_EXCLUDE_KEY } from '../constants/transformer.constant.js';
import { TransformerExcludeMetadata } from '../types/transformer-exclude-metadata.type.js';

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
    private classValidator: ValidatorPackage | Promise<ValidatorPackage>;
    private classTransformer: TransformerPackage | Promise<TransformerPackage>;

    constructor(@Optional() private options?: ValidationPipeOptions) {
        super(options);
        this.classValidator = this.loadValidator(options?.validatorPackage);
        this.classTransformer = this.loadTransformer(options?.transformerPackage);
    }

    public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (this.expectedType) {
            metadata = { ...metadata, metatype: this.expectedType };
        }
        const metatype = metadata.metatype;
        if (!metatype || !this.toValidate(metadata)) {
            return this.isTransformEnabled ? this.transformPrimitive(value, metadata) : value;
        }

        // NestJS 12 loads class-validator/class-transformer lazily via `import()`,
        // so both packages have to be awaited before they can be used.
        this.classValidator = await this.classValidator;
        this.classTransformer = await this.classTransformer;

        const originalValue = value;
        value = this.toEmptyIfNil(value, metatype);

        const isNil = value !== originalValue;
        const isPrimitive = this.isPrimitive(value);
        this.stripProtoKeys(value);
        let entity = this.plainToClass(metatype, value);
        const originalEntity = entity;
        const isCtorNotEqual = entity.constructor !== metatype;

        if (isCtorNotEqual && !isPrimitive) {
            entity.constructor = metatype;
        } else if (isCtorNotEqual) {
            entity = { constructor: metatype };
        }
        const errors = await (this.classValidator as ValidatorPackage).validate(entity, this.validatorOptions);
        if (errors.length > 0) {
            throw await this.exceptionFactory(errors);
        }
        if (originalValue === undefined && originalEntity === '') {
            // SWC requires an empty string for validation, fall back to the original value.
            return originalValue;
        }
        if (isPrimitive) {
            entity = originalEntity;
        }
        this.removeRequestData(entity);
        if (this.isTransformEnabled) {
            return entity;
        }
        if (isNil) {
            return originalValue;
        }
        // `forbidUnknownValues` is always injected into `validatorOptions` by NestJS 12,
        // so the threshold is 1 instead of 0.
        return Object.keys(this.validatorOptions).length > 1
            ? (this.classTransformer as TransformerPackage).classToPlain(entity, this.transformOptions)
            : value;
    }

    private removeRequestData(entity: unknown): void {
        if (Array.isArray(entity)) {
            for (const item of entity) {
                this.removeRequestData(item);
            }
        } else if (isObject(entity)) {
            const record = entity as Record<string, unknown>;
            delete record['requestDto'];
            delete record['parentDto'];
            for (const key in record) {
                this.removeRequestData(record[key]);
            }
        }
    }

    private plainToClass(metatype: any, value: any): any {
        const entity: any = (this.classTransformer as TransformerPackage).plainToInstance(
            metatype,
            value,
            this.transformOptions
        );
        this.addRequestToObject(entity, null, entity.requestDto);
        this.removeExcludedFields(entity, metatype);

        return entity;
    }

    private addRequestToObject(entity: unknown, parent: unknown, request: unknown): void {
        if (Array.isArray(entity)) {
            for (const item of entity) {
                this.addRequestToObject(item, entity, request);
            }
        } else if (isObject(entity)) {
            if (entity instanceof RequestDto) {
                (entity as any).requestDto = request;
            }
            if (entity instanceof ParentDto) {
                (entity as any).parentDto = parent;
            }
            const record = entity as Record<string, unknown>;
            for (const key in record) {
                if (key !== 'parentDto' && key !== 'requestDto') {
                    this.addRequestToObject(record[key], entity, request);
                }
            }
        }
    }

    private removeExcludedFields(entity: unknown, metatype: unknown): void {
        if (!metatype || !isObject(entity)) {
            return;
        }

        const metadata: TransformerExcludeMetadata[] = Reflect.getMetadata(TRANSFORMER_EXCLUDE_KEY, metatype) || [];
        const excludedFields = metadata.filter((item) => !item.condition(entity)).map((item) => item.propertyName);
        const record = entity as Record<string, unknown>;
        for (const field of excludedFields) {
            delete record[field];
        }

        for (const key in record) {
            const value = record[key];

            if (['parentDto', 'requestDto'].includes(key)) {
                continue;
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    this.removeExcludedFields(item, item?.constructor);
                }
            } else if (isObject(value)) {
                this.removeExcludedFields(value, value.constructor);
            }
        }
    }
}
