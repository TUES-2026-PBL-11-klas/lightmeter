# ── Cluster credentials ───────────────────────────────────────────────────────

variable "k8s_host" {
  description = "Kubernetes API server endpoint"
  type        = string
}

variable "k8s_cluster_ca_certificate" {
  description = "Base64-encoded cluster CA certificate"
  type        = string
  sensitive   = true
}

variable "k8s_token" {
  description = "Service account token for Terraform"
  type        = string
  sensitive   = true
}

# ── Database ──────────────────────────────────────────────────────────────────

variable "db_name" {
  description = "PostgreSQL database name and owner username"
  type        = string
}

variable "db_instances" {
  description = "Number of PostgreSQL instances (1 = primary only, 2+ = primary + replicas)"
  type        = number
  default     = 1
}

variable "db_storage_size" {
  description = "PVC storage size for PostgreSQL (e.g. '5Gi')"
  type        = string
  default     = "5Gi"
}

variable "cnpg_chart_version" {
  description = "CloudNativePG Helm chart version"
  type        = string
  default     = "0.21.5"
}

variable "migrate_image" {
  description = "Docker image for the drizzle-kit push job (including tag)"
  type        = string
}

variable "migrate_image_digest" {
  description = <<-EOT
    SHA256 digest of the migrate image (without 'sha256:' prefix).
    Used to generate a unique Job name per deploy so Terraform creates
    a new Job instead of trying to patch the immutable existing one.
    Example: "a1b2c3d4" (first 8 chars of the full digest are sufficient).
    Tip: extract with `docker inspect --format='{{index .RepoDigests 0}}' <image>`
    or from your CI pipeline after the image push step.
  EOT
  type        = string
}


# ── Backend app ───────────────────────────────────────────────────────────────

variable "backend_image" {
  description = "Docker image for the backend (including tag)"
  type        = string
}

variable "backend_replicas" {
  description = "Number of backend pod replicas"
  type        = number
  default     = 1
}

variable "backend_port" {
  description = "Port the backend listens on"
  type        = number
  default     = 3000
}
