
resource "random_password" "migrator" {
  length           = 32
  special          = true
  override_special = "!#$%&*-_=+:?"
}

resource "kubernetes_secret_v1" "migrator_password" {
  metadata {
    name      = "${var.db_name}-migrator-password"
    namespace = kubernetes_namespace_v1.db.metadata[0].name

    labels = {
      "cnpg.io/reload" = "true"
    }
  }

  data = {
    password = random_password.migrator.result
  }

  lifecycle {
    ignore_changes = [data]
  }
}

resource "kubernetes_secret_v1" "migrator_uri" {
  metadata {
    name      = "${var.db_name}-migrator-uri"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  data = {
    uri = "postgres://app_migrator:${random_password.migrator.result}@${var.db_name}-rw:5432/${var.db_name}"
    sensitive = true
  }

  lifecycle {
    ignore_changes = [data]
  }

  depends_on = [kubernetes_secret_v1.migrator_password]
}


resource "kubernetes_job_v1" "migrate" {
  metadata {
    name      = "db-migrate-${substr(var.migrate_image_digest, 0, 8)}"
    namespace = kubernetes_namespace_v1.db.metadata[0].name

    labels = {
      app       = "db-migrate"
      component = "migration"
    }

    annotations = {
      "image-digest" = var.migrate_image_digest
    }
  }

  spec {
    parallelism   = 1
    completions   = 1
    backoff_limit = 3

    ttl_seconds_after_finished = 600

    template {
      metadata {
        labels = {
          app       = "db-migrate"
          component = "migration"
        }
      }

      spec {
        restart_policy = "Never"

        automount_service_account_token = false

        container {
          name  = "migrate"
          image = var.migrate_image


          command = ["bunx", "drizzle-kit", "migrate"]

          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = "${var.db_name}-migrator-uri"
                key  = "uri"
              }
            }
          }

          security_context {
            run_as_non_root             = true
            run_as_user                 = 1000
            run_as_group                = 1000
            read_only_root_filesystem   = true
            allow_privilege_escalation  = false

            capabilities {
              drop = ["ALL"]
            }
          }

          resources {
            requests = {
              cpu    = "50m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "200m"
              memory = "256Mi"
            }
          }
        }

        volume {
          name = "tmp"
          empty_dir {}
        }
      }
    }
  }

  # Block Terraform apply until the Job completes successfully.
  # If the migration fails, the deployment resource (added separately with
  # depends_on = [kubernetes_job_v1.migrate]) will not be applied.
  wait_for_completion = true

  timeouts {
    create = "5m"
  }

  depends_on = [
    kubectl_manifest.cnpg_cluster,
    kubernetes_secret_v1.migrator_uri,
  ]
}


