import { CfnParameter, Stack } from 'aws-cdk-lib/core';
import { FieldList } from '../directive-args';
export declare const ALGOLIA_PARAMS: {
    AlgoliaAppId: string;
    AlgoliaApiKey: string;
    AlgoliaFieldsMap: string;
    AlgoliaSettingsMap: string;
};
export declare const createParametersStack: (stack: Stack, defaultFields?: Record<string, FieldList>, defaultSettings?: Record<string, string>) => Map<string, CfnParameter>;
