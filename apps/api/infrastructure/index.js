"use strict";
exports.__esModule = true;
exports.nodeEndpoint = void 0;
var azure = require("@pulumi/azure");
var pulumi = require("@pulumi/pulumi");
var stackConfig = new pulumi.Config();
var config = {
    // ===== DONT'T TOUCH THIS -> CONFIG REQUIRED BY nx-deploy-it ======
    projectName: stackConfig.get('projectName')
    // ===== END ======
};
var projectName = config.projectName;
var resourceGroup = new azure.core.ResourceGroup(projectName + "-rg");
var nodeApp = new azure.appservice.ArchiveFunctionApp(projectName + "-functions", {
    resourceGroup: resourceGroup,
    archive: new pulumi.asset.FileArchive('./functions'),
    version: '~3',
    nodeVersion: '~10',
    siteConfig: {
        cors: { allowedOrigins: ['*'] }
    }
});
exports.nodeEndpoint = nodeApp.endpoint.apply(function (endpoint) {
    return endpoint.replace(/api\/$/, '');
});
