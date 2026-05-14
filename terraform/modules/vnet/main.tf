resource "azurerm_virtual_network" "main" {
  name = "vnet-${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location = var.location
  address_space = var.vnet_address_space

  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
  }
}

resource "azurerm_subnet" "aks" {
  name =  "subnet-aks-${var.environment}"
  resource_group_name = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes = var.subnet_address_prefix
}

resource "azurerm_subnet" "appgw_subnet" {
  name                 = "agw-subnet-${var.environment}"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = var.appgw_subnet_address_prefix
}

resource "azurerm_network_security_group" "aks" {
  name = "nsg-aks-${var.environment}"
  resource_group_name = var.resource_group_name
  location = var.location

  security_rule {
    name = "allow-https"
    priority = 100
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "443"
    source_address_prefix = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name = "allow-http"
    priority = 110
    direction = "Inbound"
    access = "Allow"
    protocol = "Tcp"
    source_port_range = "*"
    destination_port_range = "80"
    source_address_prefix = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "allow-appgw-ports"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "65200-65535"
    source_address_prefix      = "GatewayManager"
    destination_address_prefix = "*"
  }

  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
  }

}

resource "azurerm_subnet_network_security_group_association" "aks" {
  subnet_id = azurerm_subnet.aks.id
  network_security_group_id = azurerm_network_security_group.aks.id
}