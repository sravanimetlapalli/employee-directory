output "workspace_id" {
  description = "Workspace id of log analytics workspace - used by the AKS for monitoring"
  value = azurerm_log_analytics_workspace.main.id
}

output "workspace_name" {
  description = "Log Analytics workspace name"
  value = azurerm_log_analytics_workspace.main.name
}

output "primary_shared_key" {
  description = "Primary Shared Key for the workspace"
  value = azurerm_log_analytics_workspace.main.primary_shared_key
  sensitive = true
}