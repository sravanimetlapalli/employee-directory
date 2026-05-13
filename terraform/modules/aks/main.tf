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
    subnet_cidr  = "10.241.0.0/16"
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

resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name = "AcrPull"
  scope = var.acr_id
  skip_service_principal_aad_check = true
}