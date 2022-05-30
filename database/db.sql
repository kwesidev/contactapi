CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE SCHEMA system;
SET search_path TO system;
-- Creates users table

CREATE TABLE tenants(
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    schema_name VARCHAR NOT NULL,
    created_on VARCHAR NOT NULL
);

INSERT INTO tenants(id, schema_name, created_on) VALUES('74b73f8a-758e-45ce-86bf-b6c0799bc79c','tenant_1',NOW());

CREATE TABLE users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_on TIMESTAMP NOT NULL,
    tenant_id uuid NOT NULL REFERENCES tenants(id)
);

INSERT INTO users(username, password, created_on, tenant_id) VALUES('kwesidev', 'password', NOW(), '74b73f8a-758e-45ce-86bf-b6c0799bc79c');

CREATE SCHEMA tenant_1 ;
SET search_path TO tenant_1;

CREATE TABLE contacts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR  NOT NULL,
    mobile_number VARCHAR  NOT NULL,
    email_address VARCHAR  NOT NULL
);

INSERT INTO contacts(first_name, last_name, mobile_number, email_address) VALUES('jackie','kwez','0658333670','anonymous@gmail.com');
