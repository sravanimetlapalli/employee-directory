output "vnet_id" {
  description = "virtual network id"
  value = azurerm_virtual_network.main.id
}

output "vnet_name" {
  description = "Virtual network name"
  value = azurerm_virtual_network.main.name
}

output "subnet_id" {
  description = "Subnet ID"
  value = azurerm_subnet.aks.id
}

output "subnet_name" {
    description = "Subnet Name"
  value = azurerm_subnet.aks.name
}

output "appgw_subnet_id" {
  description = "Application Gateway subnet ID — passed to AKS module"
  value = azurerm_subnet.appgw_subnet.id
}

output "appgw_subnet_name" {
  description = "Application Gateway subnet Name — passed to AKS module"
  value = azurerm_subnet.appgw_subnet.name
}

output "nsg_id" {
  description = "Network security group id"
  value = azurerm_network_security_group.aks.id
}