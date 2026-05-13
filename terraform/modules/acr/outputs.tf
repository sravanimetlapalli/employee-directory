output "acr_id" {
    description = "Azure container Id"
    value = azurerm_container_registry.main.id
}

output "acr_name" {
  description = "Azure container name"
  value = azurerm_container_registry.main.name
}

output "acr_login_server" {
  description = "ACR login server url - used to push and tag images"
  value = azurerm_container_registry.main.login_server
}

output "acr_admin_name" {
  description = "ACR admin username"
  value = azurerm_container_registry.main.admin_username
  sensitive = true
}

output "acr_admin_password" {
    description = "ACR admin password"
    value = azurerm_container_registry.main.admin_password
    sensitive = true
}