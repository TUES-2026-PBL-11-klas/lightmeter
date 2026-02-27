resource "kubernetes_job_v1" "push" {
  metadata {
    name      = "db-push"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  spec {
    backoff_limit = 3

    template {
      metadata {
        labels = {
          app = "db-push"
        }
      }

      spec {
        restart_policy = "Never"

        container {
          name  = "push"
          image = var.migrate_image

          command = ["bunx", "drizzle-kit", "push", "--config=drizzle.config.ts", "--force"]

          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = "${var.db_name}-app"
                key  = "uri"
              }
            }
          }
        }
      }
    }
  }

  wait_for_completion = true

  timeouts {
    create = "5m"
  }

  depends_on = [kubectl_manifest.cnpg_cluster]
}
