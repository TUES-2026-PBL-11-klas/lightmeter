# ── Backend ───────────────────────────────────────────────────────────────────

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

    policy_types = ["Ingress", "Egress"]

    ingress {
      ports {
        port     = tostring(var.backend_port)
        protocol = "TCP"
      }
      from {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "kube-system"
          }
        }
        pod_selector {
          match_labels = {
            "app.kubernetes.io/name" = "traefik"
          }
        }
      }
    }

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
      to {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "kube-system"
          }
        }
        pod_selector {
          match_labels = {
            "k8s-app" = "kube-dns"
          }
        }
      }
    }
  }
}

# ── Database ──────────────────────────────────────────────────────────────────

resource "kubernetes_network_policy_v1" "db" {
  metadata {
    name      = "db"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  spec {
    pod_selector {}

    policy_types = ["Ingress", "Egress"]

    ingress {
      ports {
        port     = "5432"
        protocol = "TCP"
      }
      from {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "app"
          }
        }
      }
    }

    ingress {
      ports {
        port     = "5432"
        protocol = "TCP"
      }
      from {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "db"
          }
        }
      }
    }

    ingress {
      from {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "cnpg-system"
          }
        }
      }
    }

    egress {
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
      to {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "kube-system"
          }
        }
        pod_selector {
          match_labels = {
            "k8s-app" = "kube-dns"
          }
        }
      }
    }
  }
}
