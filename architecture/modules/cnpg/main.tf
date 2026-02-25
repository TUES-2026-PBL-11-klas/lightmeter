terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.14"
    }
  }
}

resource "helm_release" "cnpg_operator" {
  name             = "cnpg"
  repository       = "https://cloudnative-pg.github.io/charts"
  chart            = "cloudnative-pg"
  namespace        = "cnpg-system"
  create_namespace = true
  wait             = true
}

resource "kubectl_manifest" "cnpg_cluster" {
  yaml_body = templatefile("${path.module}/cluster.yaml.tpl", {
    db_name      = var.db_name
    db_instances = var.db_instances
    storage_size = var.storage_size
  })

  depends_on = [helm_release.cnpg_operator]
}