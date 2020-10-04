import { OAuthScope, UserPool } from "@aws-cdk/aws-cognito";
import * as cdk from "@aws-cdk/core";

export class IdpStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pool = new UserPool(this, "dev-userpool", {
      userPoolName: "dev-userpool",
    });
   
    const resourceServer = new cdk.CfnResource(
      this,
      "dev-userpool-resource-server",
      {
        type: "AWS::Cognito::UserPoolResourceServer",
        properties: {
          Identifier: "https://resource-server/",
          Name: "dev-userpool-resource-server",
          Scopes: [
            {
              ScopeDescription: "Get todo items",
              ScopeName: "get-todos",
            },
          ],
          UserPoolId: pool.userPoolId,
        },
      }
    );
    
    const client = pool.addClient("console-client", {
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [OAuthScope.custom("https://resource-server//get-todos")],
      },
    });

    client.node.addDependency(resourceServer)

    pool.addDomain("dev-userpool-domain", {
      cognitoDomain: {
        domainPrefix: 'dev-userpool',
      },
    })
  }
}
