variable "resource_group_name" {
  description = "Name of the resource group"
  type = string
}

variable "location" {
    description = "Azure Region"
    type = string
}

variable "project_name"{
    description = "Name of the project"
    type = string
}

variable "environment" {
  description = "Environment values"
  type = string
}

variable "vnet_address_space" {
  description = "VNetwork address"
  type = list(string)
  default = [ "10.0.0.0/8" ]
}

variable "subnet_address_prefix" {
  description = "Subnet for AKS cluster"
  type = list(string)
  default = [ "10.270.0.0/16" ]
}