output "backend_service" {
  description = "Kubernetes Service name of the backend"
  value       = kubernetes_service_v1.backend.metadata[0].name
}

output "db_cluster_name" {
  description = "CNPG Cluster name"
  value       = var.db_name
}

output "db_app_secret" {
  description = "Secret name containing DATABASE_URL (key: uri)"
  value       = "${var.db_name}-app"
}
