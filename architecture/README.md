# Infrastructure

Terraform конфигурация за деплой на backend приложение върху Kubernetes. Управлява namespace изолация, PostgreSQL StatefulSet, database migrations и backend deployment.
 
## Структура

```
.
├── providers.tf          # Terraform и Kubernetes provider-и
├── variables.tf          # Всички input variables
├── namespaces.tf         # Kubernetes namespaces
├── database.tf           # PostgreSQL StatefulSet, Service, пароли, init script
├── migration.tf          # Migration Job и connection string secrets
├── backend.tf            # Backend Deployment, Service, Ingress, HPA
├── network_policies.tf   # Мрежова изолация между namespaces
├── outputs.tf            # Output values
├── init.sh.tpl           # PostgreSQL init скрипт (roles и привилегии)
└── terraform.tfvars.example
```

## Архитектура

```
                        Internet
                           │
                      [ Traefik ]
                           │
              ┌────────────▼────────────┐
              │       namespace: app     │
              │                         │
              │  ┌─────────────────┐    │
              │  │  Backend (HPA)  │    │
              │  │  Deployment     │    │
              │  └────────┬────────┘    │
              └───────────┼─────────────┘
                          │ postgres://app@...
                          │ (NetworkPolicy: само port 5432)
              ┌───────────▼─────────────┐
              │       namespace: db      │
              │                         │
              │  ┌─────────────────┐    │
              │  │   PostgreSQL    │    │
              │  │   StatefulSet   │    │
              │  └─────────────────┘    │
              │                         │
              │  ┌─────────────────┐    │
              │  │  Migrate Job    │    │
              │  │  (при deploy)   │    │
              │  └─────────────────┘    │
              └─────────────────────────┘
```

## Database роли

Postgres се инициализира с два отделни роли с различни привилегии:

|Роля|Използва се от|Привилегии|
|---|---|---|
|`app`|Backend (runtime)|`SELECT, INSERT, UPDATE, DELETE`|
|`app_migrator`|Migration Job|Пълен DDL достъп (`ALL PRIVILEGES`)|

Разделението гарантира, че компрометиран backend pod не може да прави структурни промени по схемата.

## Secrets и namespace изолация

Connection string-овете се пазят в отделни secrets по namespace — backend-ът в `app` namespace вижда само своя `app` connection string и никога не получава достъп до `app_migrator` credentials, които живеят единствено в `db` namespace.

```
namespace: db
├── <db>-postgres-env       # Postgres контейнер (init env vars)
├── <db>-migrator-uri       # Migration Job connection string
└── <db>-migrator-password  # Migrator парола (за reference)

namespace: app
└── <db>-app                # Backend connection string (само DML достъп)
```

## Migration стратегия

При всеки деплой се създава нов `kubernetes_job_v1` с уникално име базирано на image digest:

```
db-migrate-<първите 8 символа на digest>
```

Това гарантира, че Terraform винаги създава нов Job вместо да се опитва да patch-не immutable стар. Job-ът се самопочиства 10 минути след приключване (`ttl_seconds_after_finished = 600`) и backend deployment-ът чака успешното му завършване преди да стартира (`depends_on`).

## Използване

```bash
cp terraform.tfvars.example terraform.tfvars
# Попълни стойностите в terraform.tfvars

terraform init
terraform plan
terraform apply
```

Необходими variables без defaults:

| Variable                     | Описание                                      |
| ---------------------------- | --------------------------------------------- |
| `k8s_host`                   | Kubernetes API endpoint                       |
| `k8s_cluster_ca_certificate` | Base64-encoded CA сертификат                  |
| `k8s_token`                  | Service account token                         |
| `db_name`                    | Име на базата и owner потребителя             |
| `backend_image`              | Docker image на backend-а (с таг)             |
| `migrate_image`              | Docker image на migration job-а (с таг)       |
| `migrate_image_digest`       | SHA256 digest на migration image-а            |
| `backend_host`               | Hostname за Ingress (напр. `api.example.com`) |