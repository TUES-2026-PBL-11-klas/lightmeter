module "backend" {
  source       = "./modules/backend"
  image_source = "rangelovkiril/lightmeter-backend:latest"
  replicas     = var.replicas
}

module "cnpg" {
  source = "./modules/cnpg"

  db_name      = var.db_name
  db_instances = var.db_instances
  storage_size = var.storage_size
}