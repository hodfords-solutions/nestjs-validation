export type TransformerExcludeMetadata = {
    propertyName: string;
    condition: (entity: unknown) => boolean;
};
