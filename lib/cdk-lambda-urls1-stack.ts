import * as cdk from "aws-cdk-lib";
import {
	aws_lambda as lambda,
	aws_lambda_nodejs as lambdaNode,
	aws_logs as logs,
} from "aws-cdk-lib";
import type { Construct } from "constructs";

export class CdkLambdaUrls1Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// The code that defines your stack goes here
		// CloudWatch Logs Group (7 day retention) for Lambda
		const fnLogGroup = new logs.LogGroup(this, "Lambda1LogGroup", {
			logGroupName: "/aws/lambda/Lambda1Function",
			retention: logs.RetentionDays.ONE_WEEK,
			removalPolicy: cdk.RemovalPolicy.DESTROY, // dev convenience; change to RETAIN for production
		});

		const fn = new lambdaNode.NodejsFunction(this, "Lambda1Function", {
			runtime: lambda.Runtime.NODEJS_20_X,
			entry: "lambda/lambda1/index.ts",
			handler: "handler",
			logGroup: fnLogGroup,
			environment: {
				NODE_OPTIONS: "--enable-source-maps",
			},
		});

		const fnUrl = fn.addFunctionUrl({
			authType: lambda.FunctionUrlAuthType.NONE,
			cors: {
				allowedOrigins: ["*"],
				// NOTE: OPTIONS は Function URL の CORS AllowMethods には指定不可 (自動的にプリフライト用に処理される)
				// 必要メソッドのみ列挙。全許可したい場合は FunctionUrlCorsHttpMethod.ALL を使用。
				allowedMethods: [lambda.HttpMethod.GET, lambda.HttpMethod.HEAD],
			},
		});

		new cdk.CfnOutput(this, "Lambda1FunctionUrl", {
			value: fnUrl.url,
			description: "Invoke URL for Lambda1 /hello endpoint",
		});
	}
}
