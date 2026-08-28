import { HeaderResolver, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { TranslationModule, RequestResolver } from '@hodfords/nestjs-cls-translation';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const i18nConfig = TranslationModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
        path: path.join(currentDir, '../i18n/'),
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
