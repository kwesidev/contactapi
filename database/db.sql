
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE contacts (
    uu_id uuid DEFAULT uuid_generate_v4() NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    mobile character varying NOT NULL,
    email_address character varying NOT NULL,
    user_id uuid DEFAULT 'a4d96ac3-cc64-4dd6-be03-8d0c15887276'::uuid NOT NULL
);


CREATE TABLE users (
    uu_id uuid DEFAULT uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);




