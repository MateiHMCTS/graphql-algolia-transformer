import { GraphQLAPIProvider, TransformerContextProvider } from '@aws-amplify/graphql-transformer-interfaces';
import {
  EventSourceMapping, IFunction, LayerVersion, Runtime, StartingPosition,
} from 'aws-cdk-lib/aws-lambda';
import {
  CfnParameter, Fn, Stack, Duration,
} from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import {
  Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { ResourceConstants, SearchableResourceIDs } from 'graphql-transformer-common';
import * as path from 'path';
import { ALGOLIA_PARAMS } from './create-cfnParameters';

export const createLambda = (
  stack: Stack,
  apiGraphql: GraphQLAPIProvider,
  parameterMap: Map<string, CfnParameter>,
  lambdaRole: IRole,
): IFunction => {
  const { OpenSearchStreamingLambdaFunctionLogicalID } = ResourceConstants.RESOURCES;
  const { OpenSearchStreamingLambdaHandlerName, OpenSearchDebugStreamingLambda } = ResourceConstants.PARAMETERS;
  const { AlgoliaAppId, AlgoliaApiKey, AlgoliaFieldsMap, AlgoliaSettingsMap} = ALGOLIA_PARAMS;

  const enviroment: { [key: string]: string } = {
    DEBUG: parameterMap.get(OpenSearchDebugStreamingLambda)!.valueAsString,
    ALGOLIA_APP_ID: parameterMap.get(AlgoliaAppId)!.valueAsString,
    ALGOLIA_API_KEY: parameterMap.get(AlgoliaApiKey)!.valueAsString,
    ALGOLIA_FIELDS_MAP: parameterMap.get(AlgoliaFieldsMap)!.valueAsString,
    ALGOLIA_SETTINGS_MAP: parameterMap.get(AlgoliaSettingsMap)!.valueAsString,
  };

  return apiGraphql.host.addLambdaFunction(
    OpenSearchStreamingLambdaFunctionLogicalID,
    `functions/${OpenSearchStreamingLambdaFunctionLogicalID}.zip`,
    parameterMap.get(OpenSearchStreamingLambdaHandlerName)!.valueAsString,
    path.resolve(__dirname, '..', '..', 'lib', 'algolia-lambda.zip'),
    Runtime.PYTHON_3_8,
    [
      LayerVersion.fromLayerVersionArn(
        stack,
        'LambdaLayerVersion',
        Fn.findInMap('LayerResourceMapping', Fn.ref('AWS::Region'), 'layerRegion'),
      ),
    ],
    lambdaRole,
    enviroment,
    undefined,
    stack,
  );
};

export const createLambdaRole = (context: TransformerContextProvider, stack: Construct, parameterMap: Map<string, CfnParameter>): IRole => {
  const { OpenSearchStreamingLambdaIAMRoleLogicalID } = ResourceConstants.RESOURCES;
  const { OpenSearchStreamingIAMRoleName } = ResourceConstants.PARAMETERS;
  const role = new Role(stack, OpenSearchStreamingLambdaIAMRoleLogicalID, {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    roleName: context.resourceHelper.generateIAMRoleName(parameterMap.get(OpenSearchStreamingIAMRoleName)?.valueAsString ?? ''),
  });
  role.attachInlinePolicy(
    new Policy(stack, 'CloudwatchLogsAccess', {
      statements: [
        new PolicyStatement({
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          effect: Effect.ALLOW,
          resources: ['arn:aws:logs:*:*:*'],
        }),
      ],
    }),
  );

  return role;
};

export const createEventSourceMapping = (
  stack: Construct,
  type: string,
  target: IFunction,
  parameterMap: Map<string, CfnParameter>,
  tableStreamArn: string,
): EventSourceMapping => {
  const { OpenSearchStreamBatchSize, OpenSearchStreamMaximumBatchingWindowInSeconds } = ResourceConstants.PARAMETERS;
  return new EventSourceMapping(stack, SearchableResourceIDs.SearchableEventSourceMappingID(type), {
    eventSourceArn: tableStreamArn,
    target,
    batchSize: parameterMap.get(OpenSearchStreamBatchSize)!.valueAsNumber,
    maxBatchingWindow: Duration.seconds(parameterMap.get(OpenSearchStreamMaximumBatchingWindowInSeconds)!.valueAsNumber),
    enabled: true,
    startingPosition: StartingPosition.LATEST,
  });
};
