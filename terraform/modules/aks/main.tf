resource "azurerm_kubernetes_cluster" "main" {
  name = var.aks_cluster_name
  location = var.location
  resource_group_name = var.resource_group_name
  dns_prefix = "${var.project_name}-${var.environment}"
  kubernetes_version = var.kubernetes_version
 // automatic_channel_upgrade = "patch"
  sku_tier = "Free"

  default_node_pool {
    name = "systempool"
    node_count = var.aks_node_count
    vm_size = var.aks_node_size
    vnet_subnet_id = var.subnet_id
    type = "VirtualMachineScaleSets"

    enable_auto_scaling = true
    min_count = var.aks_min_node_count
    max_count = var.aks_max_node_count

    # disk size for each node
    os_disk_size_gb = 30
    tags = { 
        environment = var.environment
        project = var.project_name
        managed_by = "terraform"
   }
}

# identity - for pulling docker images
identity {
  type = "SystemAssigned"
}

# azure ad integration
azure_active_directory_role_based_access_control {
  admin_group_object_ids = var.admin_group_object_ids
  azure_rbac_enabled = true
  managed = true
}

# networking
network_profile {
  network_plugin = "azure"
  network_policy = "azure"
  load_balancer_sku = "standard"
  service_cidr = "10.0.0.0/16"
  dns_service_ip = "10.0.0.10"
}

# Application gateway ingress controller
ingress_application_gateway {
    gateway_name = "agw-${var.project_name}-${var.environment}"
    subnet_id = var.appgw_subnet_id
  }

# monitor_metrics 
oms_agent {
  log_analytics_workspace_id = var.log_analytics_id
}

# # maintainenace window

# maintenance_window {
#   allowed {
#     day = "Sunday"
#     hours = [2,3]
#   }
# }

tags = {
    environment = var.environment
    project = var.project_name
    managed_by = "terraform"
}
}

# Granting permissions to pull images from ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name = "AcrPull"
  scope = var.acr_id
  skip_service_principal_aad_check = true
}

# Granting Network contributor to AGIC available on VNET
resource "azurerm_role_assignment" "agic_network_contributor_vnet" {
  principal_id                     = azurerm_kubernetes_cluster.main.ingress_application_gateway[0].ingress_application_gateway_identity[0].object_id
  role_definition_name             = "Network Contributor"
  scope                            = var.vnet_id
  skip_service_principal_aad_check = true

  depends_on = [
    azurerm_kubernetes_cluster.main
  ]
}

# Granting Network contributor for AGIC on APP Gateway Subnet
resource "azurerm_role_assignment" "agic_network_contributor_subnet" {
  principal_id                     = azurerm_kubernetes_cluster.main.ingress_application_gateway[0].ingress_application_gateway_identity[0].object_id
  role_definition_name             = "Network Contributor"
  scope                            = var.appgw_subnet_id
  skip_service_principal_aad_check = true

  depends_on = [
    azurerm_kubernetes_cluster.main
  ]
}

# ── Get App Gateway data after AKS creates it ──────────
data "azurerm_application_gateway" "agic" {
  name                = "agw-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_kubernetes_cluster.main.node_resource_group

  depends_on = [
    azurerm_kubernetes_cluster.main
  ]
}

# ── Contributor on App Gateway ─────────────────────────
resource "azurerm_role_assignment" "agic_contributor_appgw" {
  principal_id                     = azurerm_kubernetes_cluster.main.ingress_application_gateway[0].ingress_application_gateway_identity[0].object_id
  role_definition_name             = "Contributor"
  scope                            = data.azurerm_application_gateway.agic.id
  skip_service_principal_aad_check = true

  depends_on = [
    azurerm_kubernetes_cluster.main,
    data.azurerm_application_gateway.agic
  ]
}

