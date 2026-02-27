resource "kubernetes_namespace_v1" "db" {
  metadata {
    name = "db"
  }
}

resource "kubernetes_namespace_v1" "app" {
  metadata {
    name = "app"
  }
}
