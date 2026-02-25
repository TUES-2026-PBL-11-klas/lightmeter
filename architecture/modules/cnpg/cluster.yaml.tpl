apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: ${db_name}
  namespace: default
spec:
  instances: ${db_instances}
  storage:
    size: ${storage_size}
  bootstrap:
    initdb:
      database: ${db_name}
      owner: ${db_name}