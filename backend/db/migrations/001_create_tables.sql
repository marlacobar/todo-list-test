-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS "user" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"username"	VARCHAR(30) NOT NULL UNIQUE,
	"password_hash"	VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS "rol" (
	"rol_id"	INTEGER NOT NULL UNIQUE,
	"rol_name"	VARCHAR(20) NOT NULL UNIQUE,
	PRIMARY KEY("rol_id" AUTOINCREMENT)
);

-- Crear tabla de automóviles
CREATE TABLE IF NOT EXISTS "car" (
	"car_id"	INTEGER NOT NULL UNIQUE,
	"license_plate"	VARCHAR(15) NOT NULL,
	"brand"	VARCHAR(50),
	"color"	VARCHAR(30),
	"model"	VARCHAR(50),
	"latitude"	REAL,
	"longitude"	REAL,
	PRIMARY KEY("car_id" AUTOINCREMENT)
);

-- Crear tabla de asociación entre usuarios y roles
CREATE TABLE IF NOT EXISTS "user_rol" (
	"rol_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	PRIMARY KEY("rol_id","user_id"),
	FOREIGN KEY("rol_id") REFERENCES "rol"("rol_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);

-- Crear tabla de asociación entre usuarios y automóviles
CREATE TABLE IF NOT EXISTS "user_car" (
	"user_id"	INTEGER NOT NULL,
	"car_id"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","car_id"),
	FOREIGN KEY("car_id") REFERENCES "car"("car_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
