// this is the main function, it calls all modules and wire them together

resource "azurerm_resource_group" "main" {
  name = var.resource_group_name
  location = var.location

  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
  }
}

module "log_analytics" {
  source = "./modules/log_analytics"

  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  project_name        = var.project_name
  environment         = var.environment
  log_retention_days  = var.log_retention_days
}

module "vnet" {
  source = "./modules/vnet"

  resource_group_name   = azurerm_resource_group.main.name
  location              = var.location
  project_name          = var.project_name
  environment           = var.environment
  vnet_address_space    = var.vnet_address_space
  subnet_address_prefix = var.subnet_address_prefix
}

module "acr" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  acr_name            = var.acr_name
  acr_sku             = var.acr_sku
  environment         = var.environment
  project_name        = var.project_name
}


module "aks" {
  source = "./modules/aks"

  resource_group_name    = azurerm_resource_group.main.name
  location               = var.location
  aks_cluster_name       = var.aks_cluster_name
  kubernetes_version     = var.kubernetes_version
  aks_node_count         = var.aks_node_count
  aks_node_size          = var.aks_node_size
  aks_min_node_count     = var.aks_min_node_count
  aks_max_node_count     = var.aks_max_node_count
  subnet_id              = module.vnet.subnet_id
  log_analytics_id       = module.log_analytics.workspace_id
  admin_group_object_ids = var.admin_group_object_ids
  environment            = var.environment
  project_name           = var.project_name

  # Allow AKS to pull images from ACR
  acr_id = module.acr.acr_id
}
