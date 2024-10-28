import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { Observable } from 'rxjs';

@Injectable()
export class AddRequestToBodyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        if (
            (request.method === 'PUT' || request.method === 'PATCH' || request.method === 'POST') &&
            request.body &&
            isObject(request.body)
        ) {
            request.body.requestDto = {
                params: request.params,
                query: request.query,
                user: request.user
            };
        }
        return next.handle();
    }
}
