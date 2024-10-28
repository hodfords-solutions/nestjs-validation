import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AddRequestToBodyInterceptor } from '../interceptors/add-request-to-body.interceptor';

export function AddRequestToBody(): any {
    return applyDecorators(UseInterceptors(AddRequestToBodyInterceptor));
}
