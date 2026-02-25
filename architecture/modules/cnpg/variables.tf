variable "db_name" {
  type        = string
}

variable "db_instances" {
  type    = number
  default = 1
}

variable "storage_size" {
  type    = string
  default = "5Gi"
}