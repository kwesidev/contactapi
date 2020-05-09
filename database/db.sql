CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE SCHEMA system;
SET search_path TO system;
-- Creates users table
CREATE TABLE users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_on TIMESTAMP NOT NULL,
    schema_name VARCHAR NOT NULL
);

INSERT INTO users(username, password, created_on, schema_name) VALUES('kwesidev', 'password', NOW(), 'customer1');

CREATE SCHEMA customer1 ;
SET search_path TO customer1;

CREATE TABLE contacts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR  NOT NULL,
    mobile_number VARCHAR  NOT NULL,
    email_address VARCHAR  NOT NULL
);

INSERT INTO contacts(first_name, last_name, mobile_number, email_address) VALUES('jackie','kwez','0658333670','anonymous@gmail.com');
