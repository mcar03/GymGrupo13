-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion;
USE gestion;

-- Eliminar tablas si ya existen (en caso de que haya alguna estructura anterior que interfiera)
DROP TABLE IF EXISTS asistencia_clases;
DROP TABLE IF EXISTS horarios_clases;
DROP TABLE IF EXISTS inscripciones_membresias;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS entrenadores;
DROP TABLE IF EXISTS clases;
DROP TABLE IF EXISTS membresias;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS empleados;

-- Tabla para Empleados
CREATE TABLE empleados (
    empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion VARCHAR(150),
    puesto VARCHAR(50) NOT NULL,
    salario DECIMAL(10, 2),
    fecha_contratacion DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Clientes
CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
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
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Entrenadores
CREATE TABLE entrenadores (
    entrenador_id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,  -- Relación con empleado_id de la tabla empleados
    especialidad VARCHAR(50),
    salario DECIMAL(10, 2),
    fecha_contratacion DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Tabla para Inscripciones a Membresías
CREATE TABLE inscripciones_membresias (
    inscripcion_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    membresia_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (membresia_id) REFERENCES membresias(membresia_id)
);

-- Tabla para Horarios de Clases
CREATE TABLE horarios_clases (
    horario_id INT AUTO_INCREMENT PRIMARY KEY,
    clase_id INT NOT NULL,
    entrenador_id INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clase_id) REFERENCES clases(clase_id),
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(entrenador_id)
);

-- Tabla para Registro de Asistencia de Clientes a Clases
CREATE TABLE asistencia_clases (
    asistencia_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    horario_id INT NOT NULL,
    fecha DATE NOT NULL,
    asistencia BOOLEAN DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (horario_id) REFERENCES horarios_clases(horario_id)
);

-- Tabla para Pagos
CREATE TABLE pagos (
    pago_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago ENUM('Efectivo', 'Tarjeta', 'Transferencia') NOT NULL,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- Insertar datos en las tablas

-- Insertar Empleados
INSERT INTO empleados (nombre, apellido, telefono, email, direccion, puesto, salario, fecha_contratacion) VALUES
('Mario', 'Díaz', '321654987', 'mario.diaz@gmail.com', 'Calle Luna 456', 'Entrenador', 20000.00, '2023-01-10'),
('Laura', 'Ramirez', '654987321', 'laura.ramirez@gmail.com', 'Calle Mar 123', 'Entrenadora', 22000.00, '2022-12-15'),
('Pedro', 'Gonzalez', '312456987', 'pedro.gonzalez@gmail.com', 'Calle Sol 567', 'Gerente', 30000.00, '2021-08-05');

-- Insertar Entrenadores
INSERT INTO entrenadores (empleado_id, especialidad, salario, fecha_contratacion) VALUES
(1, 'Yoga', 20000.00, '2023-01-10'),
(2, 'Spinning', 22000.00, '2022-12-15');

-- Insertar Membresías
INSERT INTO membresias (tipo, costo, duracion_dias, descripcion) VALUES
('Mensual', 500.00, 30, 'Acceso completo por un mes'),
('Trimestral', 1300.00, 90, 'Acceso completo por tres meses'),
('Anual', 5000.00, 365, 'Acceso completo por un año'),
('Semestral', 2800.00, 180, 'Acceso completo por seis meses');

-- Insertar Clases
INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos) VALUES
('Yoga', 'Clase de yoga para todos los niveles', 20, 60),
('Spinning', 'Clase de spinning de alta intensidad', 15, 45),
('CrossFit', 'Clase de CrossFit avanzada', 25, 60),
('Pilates', 'Clase de pilates para mejorar flexibilidad', 20, 50),
('Boxeo', 'Clase de boxeo para principiantes', 15, 60);

-- Insertar Clientes
INSERT INTO clientes (nombre, apellido, telefono, email, direccion, fecha_nacimiento) VALUES
('Juan', 'Perez', '123456789', 'juan.perez@gmail.com', 'Calle Falsa 123', '1990-01-15'),
('Ana', 'Gomez', '987654321', 'ana.gomez@gmail.com', 'Av. Principal 456', '1985-06-20'),
('Luis', 'Martinez', '234567890', 'luis.martinez@gmail.com', 'Calle Secundaria 789', '1992-03-10'),
('Maria', 'Lopez', '345678901', 'maria.lopez@gmail.com', 'Calle 5 de Mayo 234', '1988-09-12'),
('Carlos', 'Ramirez', '456789012', 'carlos.ramirez@gmail.com', 'Av. Libertad 567', '1993-11-30'),
('Elena', 'Torres', '567890123', 'elena.torres@gmail.com', 'Calle Sol 890', '1995-07-25'),
('Roberto', 'Sanchez', '678901234', 'roberto.sanchez@gmail.com', 'Av. Norte 345', '1989-04-10'),
('Lucia', 'Castro', '789012345', 'lucia.castro@gmail.com', 'Calle Sur 123', '1994-10-20'),
('Pedro', 'Diaz', '890123456', 'pedro.diaz@gmail.com', 'Av. Este 456', '1991-08-05'),
('Sofia', 'Hernandez', '901234567', 'sofia.hernandez@gmail.com', 'Calle Luna 678', '1992-12-11');

-- Insertar Inscripciones a Membresías
INSERT INTO inscripciones_membresias (cliente_id, membresia_id, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, '2024-01-01', '2024-01-31', 'activa'),
(2, 2, '2024-01-01', '2024-03-31', 'activa'),
(3, 1, '2024-01-01', '2024-01-31', 'activa'),
(4, 3, '2024-01-01', '2024-12-31', 'activa'),
(5, 1, '2024-01-01', '2024-01-31', 'activa'),
(6, 2, '2024-01-01', '2024-03-31', 'activa'),
(7, 3, '2024-01-01', '2024-12-31', 'activa'),
(8, 1, '2024-01-01', '2024-01-31', 'activa'),
(9, 2, '2024-01-01', '2024-03-31', 'activa'),
(10, 1, '2024-01-01', '2024-01-31', 'activa');

-- Insertar Horarios de Clases
INSERT INTO horarios_clases (clase_id, entrenador_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, 'Lunes', '08:00:00', '09:00:00'),
(2, 2, 'Martes', '09:00:00', '10:00:00'),
(3, 1, 'Miércoles', '10:00:00', '11:00:00'),
(4, 2, 'Jueves', '11:00:00', '12:00:00'),
(5, 1, 'Viernes', '12:00:00', '13:00:00');

-- Insertar Asistencia a Clases
INSERT INTO asistencia_clases (cliente_id, horario_id, fecha, asistencia) VALUES
(1, 1, '2024-01-01', TRUE),
(2, 2, '2024-01-02', TRUE),
(3, 3, '2024-01-03', TRUE),
(4, 4, '2024-01-04', TRUE),
(5, 5, '2024-01-05', TRUE),
(6, 1, '2024-01-01', TRUE),
(7, 2, '2024-01-02', TRUE),
(8, 3, '2024-01-03', TRUE),
(9, 4, '2024-01-04', TRUE),
(10, 5, '2024-01-05', TRUE);

-- Insertar Pagos
INSERT INTO pagos (cliente_id, monto, fecha_pago, metodo_pago, descripcion) VALUES
(1, 500.00, '2024-01-01', 'Tarjeta', 'Pago mensual de enero'),
(2, 1300.00, '2024-01-01', 'Efectivo', 'Pago trimestral'),
(3, 500.00, '2024-01-01', 'Transferencia', 'Pago mensual de enero'),
(4, 5000.00, '2024-01-01', 'Tarjeta', 'Pago anual'),
(5, 500.00, '2024-01-01', 'Efectivo', 'Pago mensual de enero'),
(6, 1300.00, '2024-01-01', 'Efectivo', 'Pago trimestral'),
(7, 5000.00, '2024-01-01', 'Transferencia', 'Pago anual'),
(8, 500.00, '2024-01-01', 'Tarjeta', 'Pago mensual de enero'),
(9, 1300.00, '2024-01-01', 'Efectivo', 'Pago trimestral'),
(10, 500.00, '2024-01-01', 'Tarjeta', 'Pago mensual de enero');
