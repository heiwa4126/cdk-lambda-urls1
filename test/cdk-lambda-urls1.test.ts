import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { beforeAll, describe, test } from "vitest";
import { CdkLambdaUrls1Stack } from "../lib/cdk-lambda-urls1-stack";

describe("CdkLambdaUrls1Stack", () => {
	let template: Template;
	beforeAll(() => {
		const app = new cdk.App();
		const stack = new CdkLambdaUrls1Stack(app, "TestStack");
		template = Template.fromStack(stack);
	});

	test("LogGroup retention is 7 days", () => {
		template.hasResourceProperties("AWS::Logs::LogGroup", {
			RetentionInDays: 7,
			LogGroupName: "/aws/lambda/Lambda1Function",
		});
	});

	test("Lambda Function URL CORS allows only GET and HEAD", () => {
		template.hasResourceProperties("AWS::Lambda::Url", {
			Cors: {
				AllowMethods: ["GET", "HEAD"],
				AllowOrigins: ["*"],
			},
		});
	});

	test("Output Lambda1FunctionUrl defined", () => {
		// CloudFormation template output keys can be inspected directly
		template.hasOutput("Lambda1FunctionUrl", {
			Description: "Invoke URL for Lambda1 /hello endpoint",
			Export: Match.absent(), // no export expected
		});
	});
});
