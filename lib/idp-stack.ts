import {
  CfnUserPoolResourceServer,
  OAuthScope,
  UserPool,
} from "@aws-cdk/aws-cognito";
import * as cdk from "@aws-cdk/core";

export class IdpStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pool = new UserPool(this, "dev-userpool", {
      userPoolName: "dev-userpool",
    });

    new CfnUserPoolResourceServer(this, "dev-userpool-resource-server", {
      identifier: "https://resource-server/",
      name: "dev-userpool-resource-server",
      userPoolId: pool.userPoolId,
      scopes: [
        {
          scopeDescription: "Get todo items",
          scopeName: "get-todos",
        },
      ],
    });

    pool.addClient("console-client", {
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [OAuthScope.custom("https://resource-server//get-todos")],
      },
    });

    pool.addDomain("dev-userpool-domain", {
      cognitoDomain: {
        domainPrefix: "dev-userpool",
      },
    });
  }
}
