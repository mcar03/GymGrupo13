-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion;

USE gestion;

-- Eliminar tablas si ya existen
DROP TABLE IF EXISTS inscripciones_membresias;
DROP TABLE IF EXISTS clases;
DROP TABLE IF EXISTS entrenadores;
DROP TABLE IF EXISTS membresias;
DROP TABLE IF EXISTS clientes;

-- Tabla para Entrenadores
CREATE TABLE entrenadores (
    entrenador_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    especialidad VARCHAR(50),
    salario DECIMAL(10, 2),
    fecha_contratacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Clientes
CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion VARCHAR(150),
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Membresías
CREATE TABLE membresias (
    membresia_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL,
    duracion_dias INT NOT NULL,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Clases
CREATE TABLE clases (
    clase_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    capacidad INT NOT NULL,
    duracion_minutos INT NOT NULL,
    entrenador_id INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(entrenador_id)
);

-- Tabla para Inscripciones a Membresías
CREATE TABLE inscripciones_membresias (
    inscripcion_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    membresia_id INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATE NOT NULL DEFAULT '1000-01-01',
    estado VARCHAR(20) DEFAULT 'activa',
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (membresia_id) REFERENCES membresias(membresia_id)
);

-- Trigger para establecer la fecha de fin
DELIMITER $$

CREATE TRIGGER establecer_fecha_fin
BEFORE INSERT ON inscripciones_membresias
FOR EACH ROW
BEGIN
    DECLARE duracion INT;

    -- Obtener la duración según el tipo de membresía
    SELECT duracion_dias INTO duracion
    FROM membresias
    WHERE membresia_id = NEW.membresia_id;

    -- Establecer la fecha_fin
    SET NEW.fecha_fin = DATE_ADD(NEW.fecha_inicio, INTERVAL duracion DAY);
END $$

DELIMITER ;

-- Insertar Clientes
INSERT INTO clientes (nombre, apellidos, telefono, email, direccion, fecha_nacimiento) VALUES
('Juan', 'Perez Gomez', '123456789', 'juan.perez@gmail.com', 'Calle Falsa 123', '1990-01-15'),
('Ana', 'Gomez Martinez', '987654321', 'ana.gomez@gmail.com', 'Av. Principal 456', '1985-06-20'),
('Luis', 'Martinez Lopez', '234567890', 'luis.martinez@gmail.com', 'Calle Secundaria 789', '1992-03-10'),
('Maria', 'Lopez Ramirez', '345678901', 'maria.lopez@gmail.com', 'Calle 5 de Mayo 234', '1988-09-12'),
('Carlos', 'Ramirez Torres', '456789012', 'carlos.ramirez@gmail.com', 'Av. Libertad 567', '1993-11-30'),
('Elena', 'Torres Sanchez', '567890123', 'elena.torres@gmail.com', 'Calle Sol 890', '1995-07-25'),
('Roberto', 'Sanchez Castro', '678901234', 'roberto.sanchez@gmail.com', 'Av. Norte 345', '1989-04-10'),
('Lucia', 'Castro Diaz', '789012345', 'lucia.castro@gmail.com', 'Calle Sur 123', '1994-10-20'),
('Pedro', 'Diaz Hernandez', '890123456', 'pedro.diaz@gmail.com', 'Av. Central 101', '1990-12-05');

-- Insertar Membresías
INSERT INTO membresias (tipo, costo, duracion_dias, descripcion) VALUES
('Mensual', 30.00, 30, 'Membresía mensual que permite acceso a todas las instalaciones.'),
('Trimestral', 80.00, 90, 'Membresía trimestral con descuento.'),
('Anual', 300.00, 365, 'Membresía anual con acceso ilimitado y beneficios adicionales.');

-- Insertar Entrenadores
INSERT INTO entrenadores (nombre, apellido, especialidad, salario) VALUES
('Fernando', 'Gonzalez', 'Fitness', 1500.00),
('Laura', 'Martinez', 'Yoga', 1200.00),
('Javier', 'Lopez', 'Pilates', 1300.00);

-- Insertar Clases
INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos, entrenador_id) VALUES
('Clase de Zumba', 'Clase divertida de baile y ejercicio.', 20, 60, 1),
('Clase de Yoga', 'Clase de relajación y estiramiento.', 15, 75, 2),
('Clase de Pilates', 'Clase enfocada en el fortalecimiento del core.', 10, 60, 3);

-- Insertar Inscripciones a Membresías
-- Se asume que ya existen 9 clientes, por lo que los IDs van de 1 a 9
INSERT INTO inscripciones_membresias (cliente_id, membresia_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 1),
(5, 2),
(6, 3),
(7, 1),
(8, 2),
(9, 3);