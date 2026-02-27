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
        container {
          name              = "backend"
          image             = var.backend_image
          image_pull_policy = "IfNotPresent"

          port {
            name           = "http"
            container_port = var.backend_port
          }

          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name      = "${var.db_name}-app"
                key       = "uri"           
              }
            }
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
              path = "/health"
              port = "http"
            }
            period_seconds    = 3
            failure_threshold = 10
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = "http"
            }
            period_seconds    = 10
            failure_threshold = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = "http"
            }
            period_seconds    = 5
            failure_threshold = 3
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_job_v1.push,
    kubernetes_namespace_v1.app,
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

resource "kubernetes_horizontal_pod_autoscaler_v2" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name = kubernetes_deployment_v1.backend.metadata[0].name
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

resource "kubernetes_network_policy_v1" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
  }

  spec {
    pod_selector {
      match_labels = {
        app = "backend"
      }
    }

    policy_types = ["Egress"]

    egress {
      ports {
        port     = "5432"
        protocol = "TCP"
      }
      to {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "db"
          }
        }
      }
    }

    egress {
      ports {
        port     = "53"
        protocol = "UDP"
      }
    }
  }
}
