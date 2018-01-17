
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


INSERT INTO users(uu_id,username,password) VALUES('6b9437ce-fb74-11e7-8c3f-9a214cf093ae','kwesidev','password');
INSERT INTO contacts(first_name,last_name,mobile,email_address,user_id) VALUES('jackie','kwez','0658333670','anonymous@gmail.com','6b9437ce-fb74-11e7-8c3f-9a214cf093ae');


