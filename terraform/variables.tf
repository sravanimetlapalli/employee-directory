// this defines all the variables 

// core azure settings
variable "subscription_id" {
  description = "Azure Subscription ID"
  type = string
}

variable "tenant_id" {
  description = "Azure Tenant ID"
  type = string
}

variable "location" {
  description = "Azure region for all resources"
  type = string
  default = "eastus"
}

variable "environment" {
  description = "Environment name(dev,stage,test)"
  type = string
  default = "dev"
}

variable "project_name" {
  description = "Project name used for all the resources"
  type = string
  default = "employee-directory"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type = string
  default = "rg-employee-directory"
}

// acr values

variable "acr_name" {
  description = "Azure container registry name - must be globally unique"
  type = string
}

variable "acr_sku" {
  description = "ACR Pricing tier"
  type = string
  default = "Basic"
}

// vnets and subnets

variable "vnet_address_space"{
    description = "VNET address space"
    type = list(string)
    default = [ "10.0.0.0/8" ]
}

variable "subnet_address_prefix"{
    description = "Address prefix for AKS subnet"
    type = list(string)
    default = [ "10.240.0.0/16" ]
}

// aks cluster

variable "aks_cluster_name"{
    description = "AKS Cluster Name"
    type = string
    default = "aks-employee-directory"
}

variable "aks_node_count"{
    description = "Initial no.of nodes in the nodepool"
    type = number
    default = 2
}

variable "aks_node_size"{
    description = "VM Size for AKS nodes"
    type = string
    default = "Standard_DC2as_v5"
}

variable "aks_min_node_count"{
    description = "Minimum no.of nodes for autoscaler"
    type = number
    default = 1
}

variable "aks_max_node_count" {
    description = "Max no.of nodes for autoscaling"
    type = number
    default = 3
}

variable "kubernetes_version" {
    description = "Kubernetes version for AKS"
    type = string
    default = "1.33.10"
}

variable "admin_group_object_ids" {
    description = "Object IDs of azure ad aks admin access"
    type = list(string)
}

// log_analytics

variable "log_retention_days"{
    description = "Max no.of days to retain logs"
    type = number
    default = 30
}


