# ── Passwords ─────────────────────────────────────────────────────────────────

resource "random_password" "postgres" {
  length           = 32
  special          = true
  override_special = "!#$%&*-_=+:?"
}

resource "random_password" "app" {
  length           = 32
  special          = true
  override_special = "!#$%&*-_=+:?"
}

# ── Secret with env vars injected into the Postgres container ─────────────────

resource "kubernetes_secret_v1" "postgres_env" {
  metadata {
    name      = "${var.db_name}-postgres-env"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  data = {
    POSTGRES_USER               = "postgres"
    POSTGRES_PASSWORD           = random_password.postgres.result
    POSTGRES_DB                 = var.db_name
    APP_MIGRATOR_PASSWORD       = random_password.migrator.result
    APP_PASSWORD                = random_password.app.result
  }

  lifecycle {
    ignore_changes = [data]
  }
}

# ── Init script – runs once on first boot inside /docker-entrypoint-initdb.d ──

resource "kubernetes_config_map_v1" "postgres_init" {
  metadata {
    name      = "${var.db_name}-postgres-init"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  data = {
    "init.sh" = <<-BASH
      #!/bin/bash
      set -euo pipefail

      psql -v ON_ERROR_STOP=1 \
           --username "$POSTGRES_USER" \
           --dbname   "$POSTGRES_DB" <<-SQL
        CREATE ROLE app_migrator
          WITH LOGIN PASSWORD '$APP_MIGRATOR_PASSWORD';

        CREATE ROLE app
          WITH LOGIN PASSWORD '$APP_PASSWORD';

        GRANT CREATE ON DATABASE "$POSTGRES_DB" TO app_migrator;
        GRANT CREATE ON SCHEMA public TO app_migrator;

        CREATE SCHEMA IF NOT EXISTS app
          AUTHORIZATION app_migrator;

        GRANT USAGE ON SCHEMA app TO app;

        ALTER DEFAULT PRIVILEGES
          FOR ROLE app_migrator IN SCHEMA app
          GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;

        ALTER DEFAULT PRIVILEGES
          FOR ROLE app_migrator IN SCHEMA app
          GRANT USAGE, SELECT ON SEQUENCES TO app;
      SQL
    BASH
  }
}

# ── StatefulSet ───────────────────────────────────────────────────────────────

resource "kubernetes_stateful_set_v1" "postgres" {
  metadata {
    name      = var.db_name
    namespace = kubernetes_namespace_v1.db.metadata[0].name
    labels = {
      app = "postgres"
      db  = var.db_name
    }
  }

  spec {
    service_name = "${var.db_name}-rw"
    replicas     = 1

    selector {
      match_labels = {
        app = "postgres"
        db  = var.db_name
      }
    }

    template {
      metadata {
        labels = {
          app = "postgres"
          db  = var.db_name
        }
      }

      spec {
        automount_service_account_token = false

        # fsGroup does not apply to subPath mounts (k8s limitation)
        # so we fix ownership with an init container instead.
        init_container {
          name    = "fix-permissions"
          image   = "busybox"
          command = ["sh", "-c", "chown -R 70:70 /var/lib/postgresql/data"]

          security_context {
            run_as_user = 0
          }

          volume_mount {
            name       = "data"
            mount_path = "/var/lib/postgresql/data"
            sub_path   = "pgdata"
          }
        }

        container {
          name  = "postgres"
          image = "postgres:16-alpine"

          port {
            name           = "pg"
            container_port = 5432
          }

          # All credentials come from the secret so nothing is in plain text
          env_from {
            secret_ref {
              name = kubernetes_secret_v1.postgres_env.metadata[0].name
            }
          }

          volume_mount {
            name       = "data"
            mount_path = "/var/lib/postgresql/data"
            sub_path   = "pgdata"
          }

          volume_mount {
            name       = "init"
            mount_path = "/docker-entrypoint-initdb.d"
            read_only  = true
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          readiness_probe {
            exec {
              command = ["pg_isready", "-U", "postgres", "-d", var.db_name]
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            failure_threshold     = 6
          }

          liveness_probe {
            exec {
              command = ["pg_isready", "-U", "postgres", "-d", var.db_name]
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            failure_threshold     = 3
          }
        }

        volume {
          name = "init"
          config_map {
            name         = kubernetes_config_map_v1.postgres_init.metadata[0].name
            default_mode = "0755"
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = "data"
      }
      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = var.db_storage_size
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_namespace_v1.db,
    kubernetes_secret_v1.postgres_env,
    kubernetes_config_map_v1.postgres_init,
  ]
}

# ── Service (same name as the old CNPG -rw service — nothing else needs change)

resource "kubernetes_service_v1" "postgres" {
  metadata {
    name      = "${var.db_name}-rw"
    namespace = kubernetes_namespace_v1.db.metadata[0].name
  }

  spec {
    selector = {
      app = "postgres"
      db  = var.db_name
    }
    port {
      name        = "pg"
      port        = 5432
      target_port = "pg"
    }
    type = "ClusterIP"
  }
}
