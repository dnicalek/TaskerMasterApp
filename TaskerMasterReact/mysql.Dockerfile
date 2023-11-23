FROM mysql:latest

COPY setup.sql/init.sql /docker-entrypoint-initdb.d
