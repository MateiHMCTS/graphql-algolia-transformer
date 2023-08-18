"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParametersStack = exports.ALGOLIA_PARAMS = void 0;
const graphql_transformer_common_1 = require("graphql-transformer-common");
const core_1 = require("aws-cdk-lib/core");
const AlgoliaAppId = "AlgoliaAppId";
const AlgoliaApiKey = "AlgoliaApiKey";
const AlgoliaFieldsMap = "AlgoliaFieldsMap";
const AlgoliaSettingsMap = "AlgoliaSettingsMap";
exports.ALGOLIA_PARAMS = {
    AlgoliaAppId,
    AlgoliaApiKey,
    AlgoliaFieldsMap,
    AlgoliaSettingsMap
};
const createParametersStack = (stack, defaultFields, defaultSettings) => {
    const { OpenSearchAccessIAMRoleName, OpenSearchStreamingLambdaHandlerName, OpenSearchStreamingLambdaRuntime, OpenSearchStreamingFunctionName, OpenSearchStreamBatchSize, OpenSearchStreamMaximumBatchingWindowInSeconds, OpenSearchStreamingIAMRoleName, OpenSearchDebugStreamingLambda, } = graphql_transformer_common_1.ResourceConstants.PARAMETERS;
    return new Map([
        [
            AlgoliaAppId,
            new core_1.CfnParameter(stack, AlgoliaAppId, {
                description: 'Algolia App ID.',
                default: "",
            }),
        ],
        [
            AlgoliaApiKey,
            new core_1.CfnParameter(stack, AlgoliaApiKey, {
                description: 'Algolia API Key.',
                default: "",
            }),
        ],
        [
            AlgoliaFieldsMap,
            new core_1.CfnParameter(stack, AlgoliaFieldsMap, {
                description: 'An object specifying fields to either include in or exclude from the Angolia Index. The object keys are the model names that were annotated with @algolia. { post: { include: ["title"] } }',
                default: JSON.stringify(defaultFields !== null && defaultFields !== void 0 ? defaultFields : ""),
            }),
        ],
        [
            AlgoliaSettingsMap,
            new core_1.CfnParameter(stack, AlgoliaSettingsMap, {
                description: 'The Angolia Index Settings. The object keys are the model names that were annotated with @algolia. { settings: {...}, forwardsToReplica?: boolean, requestOptions?: {...} }',
                default: JSON.stringify(defaultSettings !== null && defaultSettings !== void 0 ? defaultSettings : ""),
            }),
        ],
        [
            OpenSearchAccessIAMRoleName,
            new core_1.CfnParameter(stack, OpenSearchAccessIAMRoleName, {
                description: 'The name of the IAM role assumed by AppSync for OpenSearch.',
                default: 'AppSyncOpenSearchRole',
            }),
        ],
        [
            OpenSearchStreamingLambdaHandlerName,
            new core_1.CfnParameter(stack, OpenSearchStreamingLambdaHandlerName, {
                description: 'The name of the lambda handler.',
                default: 'python_algolia_function.lambda_handler',
            }),
        ],
        [
            OpenSearchStreamingLambdaRuntime,
            new core_1.CfnParameter(stack, OpenSearchStreamingLambdaRuntime, {
                // eslint-disable-next-line no-multi-str
                description: 'The lambda runtime \
                (https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime)',
                default: 'python3.6',
            }),
        ],
        [
            OpenSearchStreamingFunctionName,
            new core_1.CfnParameter(stack, OpenSearchStreamingFunctionName, {
                description: 'The name of the streaming lambda function.',
                default: 'DdbToEsFn',
            }),
        ],
        [
            OpenSearchStreamBatchSize,
            new core_1.CfnParameter(stack, OpenSearchStreamBatchSize, {
                description: 'The maximum number of records to stream to OpenSearch per batch.',
                type: 'Number',
                default: 100,
            }),
        ],
        [
            OpenSearchStreamMaximumBatchingWindowInSeconds,
            new core_1.CfnParameter(stack, OpenSearchStreamMaximumBatchingWindowInSeconds, {
                description: 'The maximum amount of time in seconds to wait for DynamoDB stream records before sending to streaming lambda.',
                type: 'Number',
                default: 1,
            }),
        ],
        [
            OpenSearchAccessIAMRoleName,
            new core_1.CfnParameter(stack, OpenSearchStreamingIAMRoleName, {
                description: 'The name of the streaming lambda function IAM role.',
                default: 'SearchLambdaIAMRole',
            }),
        ],
        [
            OpenSearchDebugStreamingLambda,
            new core_1.CfnParameter(stack, OpenSearchDebugStreamingLambda, {
                description: 'Enable debug logs for the Dynamo -> OpenSearch streaming lambda.',
                default: 0,
                type: 'Number',
                allowedValues: ['0', '1'],
            }),
        ],
    ]);
};
exports.createParametersStack = createParametersStack;
//# sourceMappingURL=create-cfnParameters.js.map