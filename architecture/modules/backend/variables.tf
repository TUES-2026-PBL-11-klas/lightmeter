variable "image_source" {
  description = "Image with backend"
  type        = string
}

variable "replicas" {
  type    = number 
  default = 1
}