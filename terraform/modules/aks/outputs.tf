output "aks_cluster_id" {
  description = "Azure AKS cluster Id"
  value = azurerm_kubernetes_cluster.main.id
}

output "aks_cluster_name" {
  description = "AKS Cluster Name"
  value = azurerm_kubernetes_cluster.main.name
}

output "kube_config" {
  description = "Kubernetes config for kubectl"
  value = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive = true
}

output "host" {
  description = "AKS Cluster host URL"
  value = azurerm_kubernetes_cluster.main.kube_config[0].host
  sensitive = true
}

output "kubelet_identity" {
  description = "Kubelet managed identity object ID"
  value = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
}

output "node_resource_group" {
  description = "Auto created resource group for AKS nodes"
  value       = azurerm_kubernetes_cluster.main.node_resource_group
}

output "app_gateway_id" {
  description = "Application Gateway ID"
  value = azurerm_kubernetes_cluster.main.ingress_application_gateway[0].effective_gateway_id
}

output "app_gateway_name" {
  description = "Application Gateway name"
  value       = "agw-${var.project_name}-${var.environment}"
}