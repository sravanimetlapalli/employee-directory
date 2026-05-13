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

output "nsg_id" {
  description = "Network security group id"
  value = azurerm_network_security_group.aks.id
}