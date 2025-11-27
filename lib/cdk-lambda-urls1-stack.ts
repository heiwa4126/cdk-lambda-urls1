import * as cdk from "aws-cdk-lib";
import {
	aws_iam as iam,
	aws_lambda as lambda,
	aws_lambda_nodejs as lambdaNode,
	aws_logs as logs,
} from "aws-cdk-lib";
import { NagSuppressions } from "cdk-nag";
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

		// Custom IAM role with least privilege (no AWS managed policies)
		const fnRole = new iam.Role(this, "Lambda1FunctionRole", {
			assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
			description: "Custom execution role for Lambda1Function with least privilege",
		});

		// Add minimal CloudWatch Logs permissions
		fnRole.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
				resources: [fnLogGroup.logGroupArn],
			}),
		);

		const fn = new lambdaNode.NodejsFunction(this, "Lambda1Function", {
			runtime: lambda.Runtime.NODEJS_22_X,
			entry: "lambda/lambda1/index.ts",
			handler: "handler",
			logGroup: fnLogGroup,
			role: fnRole, // Use custom role instead of auto-generated one
			bundling: {
				forceDockerBundling: false,
				minify: true,
				sourceMap: false, // runtimeスタックトレース縮小目的で無効化 (必要なら true に)
				target: "node22",
				format: lambdaNode.OutputFormat.CJS, // Lambda Node.js ランタイム互換 (ESM不要ならCJSで僅かに軽量)
				mainFields: ["module", "main"], // 優先的に最適なエントリポイントを選択
				metafile: false, // サイズ解析用メタファイル出力
				externalModules: ["aws-sdk"], // v2 SDKはランタイム同梱。必要ならコメント解除
				// define: { "process.env.NODE_ENV": '"production"' }, // 条件分岐除去に有効
			},
		});

		// Suppress AwsSolutions-L1: Node.js 22.x is the latest runtime
		NagSuppressions.addResourceSuppressions(fn, [
			{
				id: "AwsSolutions-L1",
				reason:
					"Node.js 22.x is the latest available runtime version. CDK Nag may not recognize it yet.",
			},
		]);

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
