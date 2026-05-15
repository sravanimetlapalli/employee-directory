terraform{
    required_version = ">=1.0.0" //Required minimum version to run the terraform

    // what providers to use within this configuration and where to source it from
    required_providers{ 
        // manages azure resources like acr, vnet, aks
        azurerm = {
            source = "hashicorp/azurerm"
            version = "~> 3.0" // provider version
        }
        // manages azure active directory resources
        azuread = {
            source = "hashicorp/azuread"
            version = "~> 2.0"
        }
    }

// defines where your terraform state file should store, we are storing the state file in azure blob storage created earlier.
backend "azurerm" {
    resource_group_name = "rg-terraform-state-file"
    storage_account_name = "tfstatefile2026"
    container_name = "tfstate"
    // key = "employee-directory.tfstate" // name of the statefile inside the container - this key will be passed through backend-config during init
}
}

// configures the azure provider and key_vault feature deletes the keys when we run terraform destroy
provider "azurerm" {
    features {
      key_vault {
        purge_soft_delete_on_destroy = true
      }
    }
}

provider "azuread" {}
