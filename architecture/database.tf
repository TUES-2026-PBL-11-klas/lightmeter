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
    db_name      = var.db_name
    db_instances = var.db_instances
    storage_size = var.db_storage_size
  })

  depends_on = [
    helm_release.cnpg_operator,
    kubernetes_namespace_v1.db,
  ]
}
