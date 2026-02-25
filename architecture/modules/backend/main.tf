locals {
  app_name = "backend-api"
  
  common_labels = {
    app       = "backend"
    part-of   = "my-awesome-app"
    managed-by = "terraform"
  }
}

resource "kubernetes_deployment_v1" "backend" {
  metadata {
    name   = local.app_name
    labels = local.common_labels
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = local.common_labels.app
      }
    }

    template {
      metadata {
        labels = {
          app = local.common_labels.app
        }
      }

      spec {
        container {
          image = var.image_source
          name  = "server"

          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "backend_lb" {
  metadata {
    name   = "${local.app_name}-lb"
    labels = local.common_labels
  }

  spec {
    selector = {
      app = local.common_labels.app
    }

    type = "LoadBalancer"

    port {
      port        = 81       
      target_port = 3000  
      protocol    = "TCP"
    }
  }
}