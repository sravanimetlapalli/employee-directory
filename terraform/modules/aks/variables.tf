variable "resource_group_name" {
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
  description = "Environment values -  dev, stage, prod"
  type = string
}

variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type = string
}

variable "kubernetes_version" {
  description = "Kubernetes Version"
  type = string
  default = "1.31"
}

variable "aks_node_count" {
  description = "Initial no. of nodes"
  type = number
  default = 1
}

variable "aks_node_size" {
  description = "VMs Size for nodes"
  type = string
  default = "Standard_DC2ads_v5"
}

variable "aks_min_node_count" {
  description = "min nodes for autoscaling"
  type = number
  default = 1
}

variable "aks_max_node_count" {
  description = "max nodes for autoscaling"
  type = number
  default = 2
}

variable "subnet_id" {
  description = "Subnet ID of AKS cluster - comes from VNET module"
  type = string 
}

variable "appgw_subnet_id"{
  description = "Application gateway subnet id - comes from VNET module"
  type = string
}

variable "vnet_id" {
  description = "VNET resource ID — used for AGIC Network Contributor role"
  type        = string
}

variable "log_analytics_id" {
  description = "Log analytics id - comes from log analytics module"
  type = string
}

variable "admin_group_object_ids" {
  description = "Object IDs for aks admin"
  type = list(string)
}

variable "acr_id" {
  description = "ACR cluster id - comes from ACR module - grants permissions to AKS for pulling images"
  type = string
}