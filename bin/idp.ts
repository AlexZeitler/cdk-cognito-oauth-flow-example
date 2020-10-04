#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { IdpStack } from '../lib/idp-stack';

const app = new cdk.App();
new IdpStack(app, 'IdpStack');
