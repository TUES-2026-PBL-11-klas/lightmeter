terraform {
  required_version = ">=1.14.0"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

module "backend" {
  source       = "./modules/backend"
  image_source = "rangelovkiril/lightmeter-backend:latest"
}