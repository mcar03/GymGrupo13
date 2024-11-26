-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion;

USE gestion;

-- Eliminar tablas si ya existen
DROP TABLE IF EXISTS inscripciones_membresias;
DROP TABLE IF EXISTS clases;
DROP TABLE IF EXISTS entrenadores;
DROP TABLE IF EXISTS membresias;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;


-- Tabla para los Usuarios de la app
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



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
('Luis', 'Perez', '555-6983', 'cliente1@gymcorreo.com', 'Calle Secundaria 789', '1992-03-10'),
('Sofia', 'Gomez', '555-6896', 'cliente2@gymcorreo.com', 'Av. Principal 456', '1985-06-20'),
('Ana', 'Lopez', '555-6864', 'cliente3@gymcorreo.com', 'Calle 5 de Mayo 234', '1988-09-12'),
('Ana', 'Martinez', '555-4611', 'cliente4@gymcorreo.com', 'Calle Sol 890', '1986-07-15'),
('Sofia', 'Torres', '555-1593', 'cliente5@gymcorreo.com', 'Av. Libertad 567', '1993-11-30'),
('Luis', 'Hernandez', '555-1116', 'cliente6@gymcorreo.com', 'Calle Sur 123', '1995-07-25'),
('Sofia', 'Diaz', '555-2996', 'cliente7@gymcorreo.com', 'Calle 5 de Mayo 234', '1990-12-05'),
('José', 'Castro', '555-9572', 'cliente8@gymcorreo.com', 'Av. Central 101', '1992-06-26'),
('Lucía', 'Ramirez', '555-3335', 'cliente9@gymcorreo.com', 'Calle Falsa 123', '1990-01-15');

-- Insertar Membresías/Planes
-- Consideramos que un "plan" es equivalente a una "membresía"
INSERT INTO membresias (tipo, costo, duracion_dias, descripcion) VALUES
('Mensual', 30.00, 30, 'Membresía mensual que permite acceso a todas las instalaciones.'),
('Trimestral', 80.00, 90, 'Membresía trimestral con descuento.'),
('Anual', 300.00, 365, 'Membresía anual con acceso ilimitado y beneficios adicionales.');

-- Insertar Inscripciones a Membresías (equivalente a inscripciones de planes)
-- ID_Cliente -> corresponde a los clientes 1 a 9
-- ID_Membresia -> 1 (Mensual), 2 (Trimestral), 3 (Anual)
INSERT INTO inscripciones_membresias (cliente_id, membresia_id) VALUES
(1, 1), -- Luis con Membresía Mensual
(2, 2), -- Sofia con Membresía Trimestral
(3, 1), -- Ana con Membresía Mensual
(4, 1), -- Ana con Membresía Mensual
(5, 2), -- Sofia con Membresía Trimestral
(6, 1), -- Luis con Membresía Mensual
(7, 2), -- Sofia con Membresía Trimestral
(8, 3), -- José con Membresía Anual
(9, 1); -- Lucía con Membresía Mensual

-- Insertar Entrenadores
INSERT INTO entrenadores (nombre, apellido, especialidad, salario) VALUES
('Lucía', 'Gomez', 'Crossfit', 1500.00),
('José', 'Diaz', 'Pesas', 1200.00),
('María', 'Lopez', 'Crossfit', 1300.00),
('Lucía', 'Martinez', 'Crossfit', 1500.00),
('Carlos', 'Ramirez', 'Pesas', 1100.00);

-- Insertar Clases
INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos, entrenador_id) VALUES
('Clase de Zumba', 'Clase divertida de baile y ejercicio.', 20, 60, 1),
('Clase de Yoga', 'Clase de relajación y estiramiento.', 15, 75, 2),
('Clase de Pilates', 'Clase enfocada en el fortalecimiento del core.', 10, 60, 3);
