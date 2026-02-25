
variable "replicas" {
  type    = number
  default = 1
}

variable "db_name" {
  type        = string
  default     = "app-db"
}

variable "db_instances" {
  type        = number
  default     = 1
}

variable "storage_size" {
  type    = string
  default = "1Gi"
}