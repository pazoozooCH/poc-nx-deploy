// Inspired by https://github.com/pulumi/examples/blob/master/azure-ts-functions/index.ts

import * as pulumi from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources';
import * as storage from '@pulumi/azure-native/storage';
import { StorageAccount } from '@pulumi/azure-native/storage';
import * as web from '@pulumi/azure-native/web';
import { getConnectionString, signedBlobReadUrl } from './helpers';

export function deployFunctionApp(
  resourceGroup: ResourceGroup,
  storageAccount: StorageAccount
) {
  // Function code archives will be stored in this container.
  const codeContainer = new storage.BlobContainer('zips', {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
  });

  // Upload Azure Function's code as a zip archive to the storage account.
  const codeBlob = new storage.Blob('zip', {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    containerName: codeContainer.name,
    source: new pulumi.asset.FileArchive('./hello-world-function'),
  });

  // Define a Consumption Plan for the Function App.
  // You can change the SKU to Premium or App Service Plan if needed.
  const plan = new web.AppServicePlan('plan', {
    resourceGroupName: resourceGroup.name,
    sku: {
      name: 'Y1',
      tier: 'Dynamic',
    },
  });

  // Build the connection string and zip archive's SAS URL. They will go to Function App's settings.
  const storageConnectionString = getConnectionString(
    resourceGroup.name,
    storageAccount.name
  );
  const codeBlobUrl = signedBlobReadUrl(
    codeBlob,
    codeContainer,
    storageAccount,
    resourceGroup
  );

  const app = new web.WebApp('fa', {
    resourceGroupName: resourceGroup.name,
    serverFarmId: plan.id,
    kind: 'functionapp',
    siteConfig: {
      appSettings: [
        { name: 'AzureWebJobsStorage', value: storageConnectionString },
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~3' },
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~14' },
        { name: 'WEBSITE_RUN_FROM_PACKAGE', value: codeBlobUrl },
      ],
      http20Enabled: true,
      nodeVersion: '~14',
    },
  });

  return {
    endpoint: pulumi.interpolate`https://${app.defaultHostName}/api/Echo?name=Pulumi`,
    endpoint2: pulumi.interpolate`https://${app.defaultHostName}/api/Echo2?name=Pulumi+v2`
  }
}
