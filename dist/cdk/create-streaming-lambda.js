"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventSourceMapping = exports.createLambdaRole = exports.createLambda = void 0;
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const core_1 = require("aws-cdk-lib/core");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const graphql_transformer_common_1 = require("graphql-transformer-common");
const path = require("path");
const create_cfnParameters_1 = require("./create-cfnParameters");
const createLambda = (stack, apiGraphql, parameterMap, lambdaRole) => {
    const { OpenSearchStreamingLambdaFunctionLogicalID } = graphql_transformer_common_1.ResourceConstants.RESOURCES;
    const { OpenSearchStreamingLambdaHandlerName, OpenSearchDebugStreamingLambda } = graphql_transformer_common_1.ResourceConstants.PARAMETERS;
    const { AlgoliaAppId, AlgoliaApiKey, AlgoliaFieldsMap, AlgoliaSettingsMap } = create_cfnParameters_1.ALGOLIA_PARAMS;
    const enviroment = {
        DEBUG: parameterMap.get(OpenSearchDebugStreamingLambda).valueAsString,
        ALGOLIA_APP_ID: parameterMap.get(AlgoliaAppId).valueAsString,
        ALGOLIA_API_KEY: parameterMap.get(AlgoliaApiKey).valueAsString,
        ALGOLIA_FIELDS_MAP: parameterMap.get(AlgoliaFieldsMap).valueAsString,
        ALGOLIA_SETTINGS_MAP: parameterMap.get(AlgoliaSettingsMap).valueAsString,
    };
    return apiGraphql.host.addLambdaFunction(OpenSearchStreamingLambdaFunctionLogicalID, `functions/${OpenSearchStreamingLambdaFunctionLogicalID}.zip`, parameterMap.get(OpenSearchStreamingLambdaHandlerName).valueAsString, path.resolve(__dirname, '..', '..', 'lib', 'algolia-lambda.zip'), aws_lambda_1.Runtime.PYTHON_3_8, [
        aws_lambda_1.LayerVersion.fromLayerVersionArn(stack, 'LambdaLayerVersion', core_1.Fn.findInMap('LayerResourceMapping', core_1.Fn.ref('AWS::Region'), 'layerRegion')),
    ], lambdaRole, enviroment, undefined, stack);
};
exports.createLambda = createLambda;
const createLambdaRole = (context, stack, parameterMap) => {
    var _a, _b;
    const { OpenSearchStreamingLambdaIAMRoleLogicalID } = graphql_transformer_common_1.ResourceConstants.RESOURCES;
    const { OpenSearchStreamingIAMRoleName } = graphql_transformer_common_1.ResourceConstants.PARAMETERS;
    const role = new aws_iam_1.Role(stack, OpenSearchStreamingLambdaIAMRoleLogicalID, {
        assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com'),
        roleName: context.resourceHelper.generateIAMRoleName((_b = (_a = parameterMap.get(OpenSearchStreamingIAMRoleName)) === null || _a === void 0 ? void 0 : _a.valueAsString) !== null && _b !== void 0 ? _b : ''),
    });
    role.attachInlinePolicy(new aws_iam_1.Policy(stack, 'CloudwatchLogsAccess', {
        statements: [
            new aws_iam_1.PolicyStatement({
                actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                effect: aws_iam_1.Effect.ALLOW,
                resources: ['arn:aws:logs:*:*:*'],
            }),
        ],
    }));
    return role;
};
exports.createLambdaRole = createLambdaRole;
const createEventSourceMapping = (stack, type, target, parameterMap, tableStreamArn) => {
    const { OpenSearchStreamBatchSize, OpenSearchStreamMaximumBatchingWindowInSeconds } = graphql_transformer_common_1.ResourceConstants.PARAMETERS;
    return new aws_lambda_1.EventSourceMapping(stack, graphql_transformer_common_1.SearchableResourceIDs.SearchableEventSourceMappingID(type), {
        eventSourceArn: tableStreamArn,
        target,
        batchSize: parameterMap.get(OpenSearchStreamBatchSize).valueAsNumber,
        maxBatchingWindow: core_1.Duration.seconds(parameterMap.get(OpenSearchStreamMaximumBatchingWindowInSeconds).valueAsNumber),
        enabled: true,
        startingPosition: aws_lambda_1.StartingPosition.LATEST,
    });
};
exports.createEventSourceMapping = createEventSourceMapping;
//# sourceMappingURL=create-streaming-lambda.js.map