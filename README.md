# cdk-lambda-urls1

AWS CDK (TypeScript) で

- TypeScript で書いた Lambda(lambda/lambda1)を Lambda function URLs
- 上の Lambda 用の専用 CloudWatch Logs グループ

をデプロイする実験。

lambda は今 express + @codegenie/serverless-express で書いてある。
Hono に変える予定。

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
