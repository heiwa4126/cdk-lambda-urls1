# cdk-lambda-urls1

AWS CDK (TypeScript) で

- TypeScript で書いた Lambda(lambda/lambda1)を Lambda function URLs
- 上の Lambda 用の専用 CloudWatch Logs グループ

をデプロイする実験。

lambda は今 express + @codegenie/serverless-express で書いてある。
Hono に変える予定
→ 変えた。

## 実行

プロジェクトディレクトリで

```sh
pnpm i
cp .env_template .env # の後、.envを編集
cdk synth # テスト
pnpm run diff # .env 読んで `cdk diff`
pnpm run deploy  # .env 読んで `cdk deploy` + outputs変換
#
pnpm run hello # API呼び出し
#
pnpm run destroy # .env 読んで `cdk destroy`
```

## メモ

`pnpm run deploy` (cdk deploy) で

> [Warning at /CdkLambdaUrls1Stack] If you are relying on AWS SDK v2 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 16 or lower. [ack: @aws-cdk/aws-lambda-nodejs:sdkV2NotInRuntime]

という警告が出る。

意味は:
「AWS Lambda のランタイムが Node.js 18 以降 (現行: 20 など) では、Lambda 環境にデフォルト同梱されている AWS SDK は v3 系です。SDK v2 はもはやランタイムに自動で入っていないため、ランタイムに入っているはずの v2 を前提にコードを書いているなら壊れるよ」
ということだそうです。

使うなら
[@aws-sdk/client-s3 - npm](https://www.npmjs.com/package/@aws-sdk/client-s3)
を使え。
