
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE TABLE users (
    uu_id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    username character varying NOT NULL,
    password character varying NOT NULL
);

CREATE TABLE contacts (
    uu_id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    mobile character varying NOT NULL,
    email_address character varying NOT NULL,
    user_id uuid  NOT NULL REFERENCES users(uu_id)
);




