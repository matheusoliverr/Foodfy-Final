DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    RESET_TOKEN TEXT,
    RESET_TOKEN_EXPIRES TEXT,
    IS_ADMIN BOOLEAN DEFAULT false,
    CREATED_AT TIMESTAMP DEFAULT(now()),
    UPDATED_AT TIMESTAMP DEFAULT(now())
)

CREATE TABLE files (
    ID SERIAL PRIMARY KEY,
    NAME TEXT,
    PATH TEXT NOT NULL
)

CREATE TABLE chefs (
    ID SERIAL PRIMARY KEY,
    NAME TEXT NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT(now()),
    FILE_ID INTEGER NOT NULL REFERENCES files(id)
)

CREATE TABLE recipes (
    ID SERIAL PRIMARY KEY,
    CHEF_ID INTEGER REFERENCES chefs(id),
    USER_ID INTEGER REFERENCES users(id),
    TITLE TEXT NOT NULL,
    INGREDIENTS TEXT[] NOT NULL,
    PREPARATION TEXT[] NOT NULL,
    INFORMATION TEXT,
    CREATED_AT TIMESTAMP DEFAULT(now())
)

CREATE TABLE recipe_files (
    ID SERIAL PRIMARY KEY,
    RECIPE_ID INTEGER REFERENCES recipes(id),
    FILE_ID INTEGER REFERENCES files(id)
)



CREATE TABLE session (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS = FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE



CREATE FUNCTION trigger_update_data()
 RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_data();

CREATE TRIGGER update_data_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_data();



-- restart to use seed.js --

DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM files;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1
