// this file exports the values which can be later used in GithubActions and kubectl

output "resource_group_name"{
    description = "Name of the resource group"
    value = azurerm_resource_group.main.name
}

output "acr_login_server" {
    description = "ACR login server url - used to tag and push the docker images"
    value = module.acr.acr_login_server
}

output "acr_name" {
    description = "ACR Name"
    value = module.acr.acr_name
}

output "aks_cluster_name" {
    description = "AKS Cluster Name - used by the kubectl and Github Actions"
    value = module.aks.aks_cluster_name
}

output "aks_cluster_id" {
    description = "AKS Cluster resource Id"
    value = module.aks.aks_cluster_id
}

output "vnet_id" {
     description = "VNET ID"
     value = module.vnet.vnet_id
}

output "subnet_id" {
     description = "AKS Subnet ID"
     value = module.vnet.subnet_id
}

output "log_analytics_workspace_id" {
    description = "Log analytics workspace id"
    value = module.log_analytics.workspace_id
}

output "kube_config" {
    description = "Kubernetes config for kubectl - sensitive field"
    value = module.aks.kube_config
    sensitive = true
}

output "app_gateway_id" {
    description = "Application Gateway ID"
    value = module.aks.app_gateway_id
}

output "app_gateway_name" {
  description = "Application Gateway Name"
  value = module.aks.app_gateway_name
}
