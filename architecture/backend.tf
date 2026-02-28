resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

resource "kubernetes_secret_v1" "backend_secrets" {
  metadata {
    name      = "backend-secrets"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  data = {
    JWT_SECRET = random_password.jwt_secret.result
  }

  lifecycle {
    ignore_changes = [data]
  }
}

resource "kubernetes_deployment_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  spec {
    replicas = var.backend_replicas

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        automount_service_account_token = false

        container {
          name              = "backend"
          image             = var.backend_image
          image_pull_policy = "Always"

          port {
            name           = "http"
            container_port = var.backend_port
          }

          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = "${var.db_name}-app"
                key  = "uri"
              }
            }
          }

          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret_v1.backend_secrets.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          env {
            name  = "REFRESH_TOKEN_EXPIRY_DAYS"
            value = tostring(var.refresh_token_expiry_days)
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          env {
            name  = "PORT"
            value = tostring(var.backend_port)
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          startup_probe {
            http_get {
              path = "/swagger"
              port = "http"
            }
            period_seconds    = 3
            failure_threshold = 10
          }

          liveness_probe {
            http_get {
              path = "/swagger"
              port = "http"
            }
            period_seconds    = 10
            failure_threshold = 3
          }

          readiness_probe {
            http_get {
              path = "/swagger"
              port = "http"
            }
            period_seconds    = 5
            failure_threshold = 3
          }

          security_context {
            run_as_non_root            = true
            run_as_user                = 1000
            run_as_group               = 1000
            read_only_root_filesystem  = true
            allow_privilege_escalation = false
            capabilities {
              drop = ["ALL"]
            }
          }

          volume_mount {
            name       = "tmp"
            mount_path = "/tmp"
          }
        }

        volume {
          name = "tmp"
          empty_dir {}
        }
      }
    }
  }

  depends_on = [
    kubernetes_job_v1.migrate,
    kubernetes_namespace_v1.app,
    kubernetes_secret_v1.backend_secrets,
  ]
}

resource "kubernetes_service_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  spec {
    selector = {
      app = "backend"
    }
    port {
      name        = "http"
      port        = 80
      target_port = "http"
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_ingress_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
    annotations = {
      "kubernetes.io/ingress.class" = "traefik"
    }
  }

  spec {
    rule {
      host = var.backend_host
      http {
        path {
          path      = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service_v1.backend.metadata[0].name
              port {
                name = "http"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment_v1.backend.metadata[0].name
    }

    min_replicas = var.backend_replicas
    max_replicas = var.backend_replicas * 4

    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 70
        }
      }
    }
  }
}
