FROM postgres:latest

ENV POSTGRES_USER username
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB database_name

ADD db_schema.sql /docker-entrypoint-initdb.d/
