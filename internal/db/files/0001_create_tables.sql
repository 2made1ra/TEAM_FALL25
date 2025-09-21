-- +goose up
CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    tid        INTEGER      NOT NULL UNIQUE,
    uuid       UUID         NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NULL,
    username   VARCHAR(255) NULL,
    created_at TIMESTAMPTZ  NOT NULL,
    updated_at TIMESTAMPTZ  NOT NULL
);
