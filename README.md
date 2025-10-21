# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## TODO

CDK の outputs.json を shell にするのを、いまスクリプトを置いてるのを、別パッケージにして再利用できるようにする。

いま
express + @codegenie/serverless-express
で出来てる lambda/lambda1 を Hono に置き換える。

## Lambda Function URL (/hello)

このスタックは Express ベースの Lambda をデプロイし、認証なしの Function URL を公開しています。

スタック出力例:

```
Lambda1FunctionUrl = https://xxxxxxxxxxxx.lambda-url.<region>.on.aws/
```

エンドポイント `/hello` へアクセスするには次のように実行します:

```bash
curl "$(npx cdk deploy --outputs-file outputs.json >/dev/null 2>&1; jq -r '.CdkLambdaUrls1Stack.Lambda1FunctionUrl' outputs.json)/hello"
```

単純に URL を控えて直接:

```bash
curl https://xxxxxxxxxxxx.lambda-url.<region>.on.aws/hello
```

レスポンス例:

```json
{ "message": "Hello from lambda1!" }
```

### 更新 / 開発ヒント

- Lambda のソース: `lambda/lambda1/app.ts`, `lambda/lambda1/index.ts`
- ログ保持期間: 7 日 (CloudWatch Logs LogRetention カスタムリソース)
- 依存ライブラリは `lambda/lambda1/package.json` に分離
