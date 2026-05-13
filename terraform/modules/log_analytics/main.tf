resource "azurerm_log_analytics_workspace" "main" {
  name = "loganalyticsworkspace-${var.project_name}-${var.environment}"
  location = var.location
  resource_group_name = var.resource_group_name
  sku = "PerGB2018"
  retention_in_days = var.log_retention_days

  tags ={
    environment = var.environment
    project = var.project_name
    managed_by = "terraform"
  }
}