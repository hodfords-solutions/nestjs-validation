import rewire from 'rewire';
import { MetadataStorageWrapper } from './metadata.storage';
import { ValidationUtils } from './validation.util';
import { MetadataStorage } from 'class-validator';

export function getRewireModule(): any {
    // Issues: https://github.com/jhnns/rewire/issues/144
    // Ref: https://github.com/jhnns/rewire/pull/149/files
    const rewireRef = rewire('rewire');
    const moduleEnvRef = rewire('rewire/lib/moduleEnv.js');

    const jsExtension = moduleEnvRef.__get__('jsExtension');
    moduleEnvRef.__set__('jsExtension', () => {
        return function (module: any, filename: any) {
            jsExtension(module, filename);
        };
    });
    rewireRef.__set__('moduleEnv', moduleEnvRef);

    return rewireRef;
}

export function getOverrideModule(metadataStorage?: MetadataStorage): any {
    const rewireRef = getRewireModule();
    const moduleRef = rewireRef('class-validator');

    // Reverse validator executor
    const storage = new MetadataStorageWrapper();
    Object.assign(storage, metadataStorage ?? globalThis.classValidatorMetadataStorage);
    moduleRef.__set__('MetadataStorage_1.getMetadataStorage', () => storage);

    // Override custom key
    const validationExecutorRef = rewireRef('class-validator/cjs/validation/ValidationExecutor.js');
    const validatorRef = rewireRef('class-validator/cjs/validation/Validator.js');
    validationExecutorRef.__set__('ValidationUtils_1.ValidationUtils', ValidationUtils);
    validatorRef.__set__('ValidationExecutor_1', validationExecutorRef);
    moduleRef.__set__('Validator_1', validatorRef);

    return moduleRef;
}
