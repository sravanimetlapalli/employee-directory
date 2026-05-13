resource "azurerm_container_registry" "main" {
  resource_group_name = var.resource_group_name
  name = var.acr_name
  location = var.location
  sku = var.acr_sku

   // disable public access for production workloads
  admin_enabled = true

  tags = { 
    environment = var.environment
    project = var.project_name
    managed_by = "terraform"
    }
  
}