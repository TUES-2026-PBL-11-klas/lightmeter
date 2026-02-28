#!/bin/bash
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    DO \$block\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_migrator') THEN
            CREATE ROLE app_migrator WITH LOGIN PASSWORD '${app_migrator_password}';
        END IF;
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app') THEN
            CREATE ROLE app WITH LOGIN PASSWORD '${app_password}';
        END IF;
    END
    \$block\$;

    GRANT ALL PRIVILEGES ON DATABASE "${db_name}" TO app_migrator;
    GRANT CONNECT ON DATABASE "${db_name}" TO app;
EOSQL

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "${db_name}" <<-EOSQL
    GRANT ALL ON SCHEMA public TO app_migrator;
    GRANT USAGE ON SCHEMA public TO app;

    ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;

    ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator IN SCHEMA public
        GRANT USAGE, SELECT ON SEQUENCES TO app;

    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_migrator;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_migrator;
EOSQL