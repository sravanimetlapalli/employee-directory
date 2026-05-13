variable "resource_group_name" {
  description = "Name of the resource group"
  type = string
}

variable "location" {
  description = "Azure region"
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

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}