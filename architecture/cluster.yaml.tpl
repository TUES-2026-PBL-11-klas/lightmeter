apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: ${db_name}  
  namespace: db
  
spec:                                                                  
  managed:                                                             
    roles:                                                             
      - name: app_migrator                                             
        ensure: present                                                
        login: true                                                    
        superuser: false                                               
        createdb: false                                                
        createrole: false                                              
        inherit: true                                                  
        comment: "Owned by the migration Job. DDL on app schema only." 
        passwordSecret:                                                
          name: ${migrator_password_secret}                                                                

      - name: app                                                      
        ensure: present                                                
        login: true                                                    
        superuser: false                                               
        createdb: false                                                
        createrole: false                                              
        inherit: true                                                  
        comment: "Runtime application role. DML only — no DDL."       
        passwordSecret:                                                
          name: ${db_name}-app      

  bootstrap:                                                          
    initdb:                                                            
      database: ${db_name}                                             
      owner: app_migrator                   
      postInitApplicationSQL:                                          
        - "CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION app_migrator" 
        - "GRANT USAGE ON SCHEMA app TO app"                           
        - "ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator              
            IN SCHEMA app                                              
            GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app"    
        - "ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator              
            IN SCHEMA app                                              
            GRANT USAGE, SELECT ON SEQUENCES TO app"                  