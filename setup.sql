
CREATE TABLE IF NOT EXISTS public.users (
 "id" VARCHAR(255) NOT NULL,
 "username" VARCHAR(255),
 "displayname" VARCHAR(255),
 "email" VARCHAR(255),
 "photo" VARCHAR(500),
 "lastlogin" TIMESTAMP DEFAULT NOW(),
 CONSTRAINT users_pkey PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS public.history (
 "id" VARCHAR(255) NOT NULL,
 "userid" VARCHAR(255) REFERENCES users(id),
 "status" VARCHAR(255),
 "question" VARCHAR(500),
 "askee" VARCHAR(500),
 "timestamp" TIMESTAMP DEFAULT NOW(),
 CONSTRAINT history_pkey PRIMARY KEY(id)
);