resource "helm_release" "cnpg_operator" {
  name             = "cnpg"
  repository       = "https://cloudnative-pg.github.io/charts"
  chart            = "cloudnative-pg"
  version          = var.cnpg_chart_version
  namespace        = "cnpg-system"
  create_namespace = true
  wait             = true
  wait_for_jobs    = true
}

resource "kubectl_manifest" "cnpg_cluster" {
  yaml_body = templatefile("${path.module}/cluster.yaml.tpl", {
    db_name                  = var.db_name
    db_instances             = var.db_instances
    storage_size             = var.db_storage_size
    migrator_password_secret = kubernetes_secret_v1.migrator_password.metadata[0].name
  })

  depends_on = [
    helm_release.cnpg_operator,
    kubernetes_namespace_v1.db,
    kubernetes_secret_v1.migrator_password,
  ]
}