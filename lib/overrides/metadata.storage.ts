import { MetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

// Ref: https://github.com/typestack/class-validator/blob/develop/src/metadata/MetadataStorage.ts

export class MetadataStorageWrapper extends MetadataStorage {
    getTargetValidationMetadatas(
        /* eslint-disable @typescript-eslint/no-unsafe-function-type */
        targetConstructor: Function,
        targetSchema: string,
        always: boolean,
        strictGroups: boolean,
        groups?: string[]
    ): ValidationMetadata[] {
        return super
            .getTargetValidationMetadatas(targetConstructor, targetSchema, always, strictGroups, groups)
            .reverse();
    }
}
