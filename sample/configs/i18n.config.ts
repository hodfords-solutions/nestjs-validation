import { HeaderResolver, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { TranslationModule, RequestResolver } from '@hodfords/nestjs-cls-translation';

export const i18nConfig = TranslationModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
        path: path.join('dist', 'i18n/'),
        watch: true
    },
    resolvers: [new HeaderResolver(['language']), new QueryResolver(['language'])],
    defaultLanguageKey: 'language',
    clsResolvers: [
        new RequestResolver([
            { key: 'language', type: 'query' },
            { key: 'language', type: 'headers' }
        ])
    ]
});
