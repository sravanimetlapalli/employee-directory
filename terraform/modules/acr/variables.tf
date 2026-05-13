variable "resource_group_name"{
    description = "Name of the resource group"
    type = string
}

variable "location" {
    description = "Azure Region"
    type = string
}

variable "project_name" {
    description = "Name of the project"
    type = string
}

variable "environment" {
    description = "Environment values"
    type = string
}

variable "acr_name" {
     description = "Name of the Azure container registry - must be globally unique and contains only numbers and letter"
     type = string
}

variable "acr_sku" {
    description = "ACR Pricing Tier - Basic, Standard, Premimum"
    type = string
    default = "Basic"
}