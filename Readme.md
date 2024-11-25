## Proyecto Gym grupo 13


### Inialización del proyecto

Para la inicialización del proyecto hemos creado en la carpeta raiz del proyecto un package "gym" dónde dentro va a tener el .env y el docker-compose.yml

**.env**

```java
MYSQL_PASSWORD=zx76wbz7FG89k
MYSQL_USERNAME=root
MYSQL_PORT=33307
MYSQL_DATABASE=gestion
MYSQL_HOST=localhost
ADMINER_PORT=8182
```

**docker-compose.yml**

```java
version: '3.1'

services:

  adminer:
    image: adminer
    restart: "no"
    ports:
      - ${ADMINER_PORT}:8080

  db-gesaca:
    image: mysql:latest
    restart: "no"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    ports:
      - ${MYSQL_PORT}:3306
    volumes:
      - ./scripts:/docker-entrypoint-initdb.d
```

Seguidamente después de crear esos dos archivos hemos ejecutado el siguiente comando

```
npm install express express-session mysql2 pug body-parser dotenv
```

¿Qué es cada cosa?



**express**: servidor Web para nodeJS.

**express-session**: gestiona sesiones (HTTP) entre el servidor Web/cliente web.

**mysql2**: driver para conectar a mysql.

**pug**: motor HTML.

**body-parser**: para convertir los datos de un formulario (verbos GET y POST) en JSON.

**dotenv**: para cargar archivos de configuración de entorno.


El haber ejecutado este comando lo que hace es que nos crea un archivo ``package.json`` para a configurar todas las dependencias...y un package ``node_modules`` con todas las librerias...


package.json

```
{
  "name": "gestion-academica",
  "version": "0.0.1",
  "description": "Gestión Académica",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "express-validator": "^7.2.0",
    "gestion-academica": "file:",
    "mysql2": "^3.11.3",
    "pug": "^3.0.3"
  }
}


```

**MUY IMPORTANTE** Después de tener creados los archivos ``.env`` y el package ``node_modules`` vamos a crear un archivo manualmente llamado **.gitignore**

.gitignore (por el momento)

```
.env
node_modules
package-lock.json
```

ahora tocará crear un package llamado ```scripts``` donde vamos a meter nuestra base de datos llamada ```initdb.sql``` este gracias a la sentencia que tenemos puesta en el docker-compose.yml se ejecutará de manera automática y tendremos acceso a todos sus tablas sin tener que hacerlo manualmente. 

Aquí adjunto una serie las tablas de nuestra bbdd sin los Insert.

initdb.sql

```java
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




```
Ya tenemos nuestra base de datos en implementada ahora simplemente ejecutar el comando :

```
docker-compose up -d 
```

La funcionalidad de este comando es montar el contenedor docker donde tiene implementado adminer para que así podamos manejar los datos de la bbdd de manera ligera.

Y por último vamos a implementar en nuestro proyecto un ```db.js``` que va a ser el encargado de establecer conexion con nuestra base de datos.

app.js

```java 
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

require('dotenv').config({ path: 'gym/.env' }); 

/**
 * Conectamos a la base de datos
 */
const db = mysql.createConnection({
    host:       process.env.MYSQL_HOST,
    port:       process.env.MYSQL_PORT,
    user:       process.env.MYSQL_USERNAME,
    password:   process.env.MYSQL_ROOT_PASSWORD,
    database:   process.env.MYSQL_DATABASE,
  });

db.connect(err => {
    if (err) {
      console.error(
        'Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conexión exitosa a MySQL');
  });

module.exports=db;

```

# CREACIÓN DE PUG (MOTOR DE PLANTILLAS)

La creación de pug consiste en crear dentro de cada package las entidades que nos van a hacer falta para nuestro proyecto... Dentro encontramos los siguientes packages: ```clases ```,```clientes ```,```entrenadores ```,```inscripciones_membresias ```,```membresias ```. Dentro de cada package tenemos unas series de clases .pug. Los Pug son un motor de plantillas html5, dónde van a ser las vistas de nuestra página web.

Antes de nada recordar que es un motor de plantillas... Cuya única funcionalidad es cargar la vista en html dónde cada parametro rellenado se enviará a un controller para crear una nueva clase en la base de datos.
Voy a enserñar de todos esos packages un ejemplo de todas las vistas .pug... En este caso serán del ```package clases```

## add.pug

```java
extends ../templates/layout

block content
    h1 Agregar Nueva Clase
    div(class="container")
        form(action="/clases/add", method="POST")
            div(class="form-group")
                label(for="nombre") Nombre de la Clase
                input(type="text", name="nombre", id="nombre", class="form-control", required=true)
            div(class="form-group")
                label(for="descripcion") Descripción
                textarea(name="descripcion", id="descripcion", class="form-control") 
            div(class="form-group")
                label(for="capacidad") Capacidad
                input(type="number", name="capacidad", id="capacidad", class="form-control", required=true)
            div(class="form-group")
                label(for="duracion_minutos") Duración (en minutos)
                input(type="number", name="duracion_minutos", id="duracion_minutos", class="form-control", required=true)
            div(class="form-group")
                label(for="entrenador_id") Entrenador
                select(name="entrenador_id", id="entrenador_id", class="form-control", required=true)
                    each entrenador in entrenadores
                        option(value=entrenador.entrenador_id)= entrenador.nombre + ' ' + entrenador.apellido
            button(type="submit", class="btn btn-primary") Guardar
        a(href="/clases", class="btn btn-secondary") Volver a la lista de clases
```


## del.pug

```java
extends ../templates/layout

block content
    h1 Eliminar Clase
    p ¿Estás seguro de que deseas eliminar la clase: #{clase.nombre}?
    div(class="container")
        form(action=`/clases/del/${clase.clase_id}`, method="POST")
            button(type="submit", class="btn btn-danger") Sí, Eliminar
        a(href="/clases", class="btn btn-secondary") No, Volver a la lista de clases
```

## edit.pug
 ```java
extends ../templates/layout

block content
    h1 Editar Clase
    div(class="container")
        form(action=`/clases/edit/${clase.clase_id}`, method="POST")
            div(class="form-group")
                label(for="nombre") Nombre de la Clase
                input(type="text", name="nombre", id="nombre", value=clase.nombre, class="form-control", required=true)
            div(class="form-group")
                label(for="descripcion") Descripción
                textarea(name="descripcion", id="descripcion", class="form-control")= clase.descripcion
            div(class="form-group")
                label(for="capacidad") Capacidad
                input(type="number", name="capacidad", id="capacidad", value=clase.capacidad, class="form-control", required=true)
            div(class="form-group")
                label(for="duracion_minutos") Duración (en minutos)
                input(type="number", name="duracion_minutos", id="duracion_minutos", value=clase.duracion_minutos, class="form-control", required=true)
            div(class="form-group")
                label(for="entrenador_id") Entrenador
                select(name="entrenador_id", id="entrenador_id", class="form-control", required=true)
                    each entrenador in entrenadores
                        option(value=entrenador.entrenador_id, selected=entrenador.entrenador_id === clase.entrenador_id)= entrenador.nombre + ' ' + entrenador.apellido
            button(type="submit", class="btn btn-primary") Guardar Cambios
        a(href="/clases", class="btn btn-secondary") Volver a la lista de clases
 ```
## list.pug

```java
//- views/clases/list.pug
extends ../templates/layout

block content
    h1 Lista de Clases
    div(class="container")
        table(class="table table-striped")
            thead
                tr
                    th Nombre
                    th Descripción
                    th Capacidad
                    th Duración (min)
                    th Entrenador
                    th Fecha de Registro
                    th Acciones
            tbody
                each clase in clases
                    tr
                        td= clase.nombre
                        td= clase.descripcion
                        td= clase.capacidad
                        td= clase.duracion_minutos
                        td= clase.entrenador_nombre + ' ' + clase.entrenador_apellido
                        td= clase.fecha_registro
                        td
                            a(href=`/clases/edit/${clase.clase_id}`, class="btn btn-primary btn-sm") Editar
                            |
                            a(href=`/clases/del/${clase.clase_id}`, class="btn btn-danger btn-sm") Eliminar
        a(href="/clases/add", class="btn btn-success") Agregar Nueva Clase
```
Además de estás clases dónde está implementado cada una de las entidades de la bbdd, encontramos un index.pug, cuyo contenido va a ser el principal, el primero que se va a cargar. En este caso el index es muy sencillo

## index.pug

```java
extends templates/layout

block content
    div(class="container")
        h3 Bienvenido a Gym13
        p Seleccione una opción de la lista para continuar
```

# Implementación CSS
En la implementación del css es muy sencillo, ya que solo tenemos que llamarlo y nuestra vista .pug estará con el estilo a nuestro gusto
en nuestro caso hemos buscado como sería con la implementación parecida a bootstrat:

## estilos.css
```java 


/* Cambiar el color de fondo del cuerpo */
body {
    background-color: #f8f9fa; /* Gris claro */
}

/* Personalizar el encabezado */
h1 {
    color: #343a40; /* Gris oscuro */
    font-weight: bold;
}

/* Botones personalizados */
.btn-primary {
    background-color: #007bff; /* Azul Bootstrap */
    border: 2px solid #0056b3; /* Bordes más oscuros */
}

/* Agregar un borde redondeado a las cajas de texto */
input.form-control {
    border-radius: 15px;
}

```

# IMPLEMENTACIÓN ROUTES

Los routes son rutas web o mapas que conectan las Url's con el código que tiene que ejecutarse. Una vez explicado de manera sencilla y breve lo que es un router hay que crear una ruta o mapeado por cada clase modelo que tenemos, cada iteración entra y "conduce" a una parte del controller para que esta se ejecute

## clasesRouter.js

```java
const express = require('express');
const router = express.Router();
const claseController = require('../controllers/clasesController');

// Ruta para listar todas las clases con información de los entrenadores
router.get('/', claseController.listarClases);

// Ruta para mostrar el formulario para agregar una nueva clase
router.get('/add', claseController.mostrarFormularioAgregar);

// Ruta para agregar una nueva clase
router.post('/add', claseController.agregarClase);

// Ruta para mostrar el formulario de edición de una clase
router.get('/edit/:id', claseController.mostrarFormularioEditar);

// Ruta para editar una clase
router.post('/edit/:id', claseController.editarClase);

// Ruta para mostrar el formulario de eliminación de una clase
router.get('/del/:id', claseController.mostrarFormularioEliminar);

// Ruta para eliminar una clase
router.post('/del/:id', claseController.eliminarClase);

module.exports = router;
```

## Rutas y sus propósitos

- **GET /**: Muestra todas las clases y su información asociada.  
  → Usa `listarClases`.

- **GET /add**: Muestra un formulario para agregar una nueva clase.  
  → Usa `mostrarFormularioAgregar`.

- **POST /add**: Agrega una nueva clase al sistema.  
  → Usa `agregarClase`.

- **GET /edit/:id**: Muestra un formulario para editar una clase específica (usando el `id` de la clase).  
  → Usa `mostrarFormularioEditar`.

- **POST /edit/:id**: Edita la información de una clase específica.  
  → Usa `editarClase`.

- **GET /del/:id**: Muestra un formulario para confirmar la eliminación de una clase.  
  → Usa `mostrarFormularioEliminar`.

- **POST /del/:id**: Elimina una clase específica del sistema.  
  → Usa `eliminarClase`.


# CREACIÓN CONTROLLERS
Los controladorrs gestionan las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) relacionadas con las clases, incluyendo información.
Para la creación de los controladores, creamos un package controllers dónde van a ir dentro todos los controladores 

Voy a poner un ejemplo de un controlador (clasesController.js) y explicarlo, ya que todos tienen la misma función

## clasesController.js

```java 
const db = require('../db'); // Importamos la conexión a la base de datos
const { validationResult } = require('express-validator');

// Listar todas las clases con información de los entrenadores
exports.listarClases = (req, res) => {
  const query = `
    SELECT clases.clase_id, clases.nombre, clases.descripcion, clases.capacidad, 
           clases.duracion_minutos, clases.fecha_registro, 
           entrenadores.nombre AS entrenador_nombre, 
           entrenadores.apellido AS entrenador_apellido
    FROM clases
    JOIN entrenadores ON clases.entrenador_id = entrenadores.entrenador_id
  `;
  
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener las clases:', err);
      return res.status(500).send('Error al obtener las clases');
    }
    res.render('clases/list', { clases: resultados });
  });
};

// Mostrar el formulario para agregar una nueva clase
exports.mostrarFormularioAgregar = (req, res) => {
  db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }
    res.render('clases/add', { entrenadores: entrenadores });
  });
};

// Agregar una nueva clase
exports.agregarClase = (req, res) => {
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('clases/add', { errors: errors.array(), entrenadores: req.entrenadores });
  }

  const query = `
    INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos, entrenador_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id], (err) => {
    if (err) {
      console.error('Error al agregar la clase:', err);
      return res.status(500).send('Error al agregar la clase');
    }
    res.redirect('/clases');
  });
};

// Mostrar el formulario para editar una clase
exports.mostrarFormularioEditar = (req, res) => {
  const { id } = req.params;

  // Obtener la clase por su ID
  db.query('SELECT * FROM clases WHERE clase_id = ?', [id], (err, claseResults) => {
    if (err) {
      console.error('Error al obtener la clase para editar:', err);
      return res.status(500).send('Error al obtener la clase');
    }

    if (claseResults.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }

    // Obtener la lista de entrenadores
    db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
      if (err) {
        console.error('Error al obtener los entrenadores:', err);
        return res.status(500).send('Error al obtener los entrenadores');
      }

      res.render('clases/edit', { clase: claseResults[0], entrenadores: entrenadores });
    });
  });
};

// Editar una clase
exports.editarClase = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('editClase', { errors: errors.array(), clase: req.body, entrenadores: req.entrenadores });
  }

  const query = `
    UPDATE clases 
    SET nombre = ?, descripcion = ?, capacidad = ?, duracion_minutos = ?, entrenador_id = ? 
    WHERE clase_id = ?
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id, id], (err) => {
    if (err) {
      console.error('Error al actualizar la clase:', err);
      return res.status(500).send('Error al actualizar la clase');
    }
    res.redirect('/clases');
  });
};

// Mostrar el formulario para eliminar una clase
exports.mostrarFormularioEliminar = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM clases WHERE clase_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener la clase para eliminar:', err);
      return res.status(500).send('Error al obtener la clase');
    }

    if (results.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }
    res.render('clases/del', { clase: results[0] });
  });
};

// Eliminar una clase
exports.eliminarClase = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM clases WHERE clase_id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar la clase:', err);
      return res.status(500).send('Error al eliminar la clase');
    }
    res.redirect('/clases');
  });
};

```

### 1. Listar todas las clases
**Ruta**: `GET /clases`  
**Descripción**: Obtiene y muestra todas las clases junto con la información del entrenador asociado.  
**Detalles**: 
- Se ejecuta una consulta para obtener los datos de las tablas `clases` y `entrenadores`.
- Renderiza la vista `clases/list` con los resultados obtenidos.

---

### 2. Mostrar el formulario para agregar una nueva clase
**Ruta**: `GET /clases/add`  
**Descripción**: Muestra un formulario para que el usuario pueda agregar una nueva clase.  
**Detalles**:
- Se consulta la lista de entrenadores para permitir la selección en el formulario.
- Renderiza la vista `clases/add`.

---

### 3. Agregar una nueva clase
**Ruta**: `POST /clases/add`  
**Descripción**: Procesa los datos enviados desde el formulario y agrega una nueva clase en la base de datos.  
**Detalles**:
- Valida los datos del formulario utilizando `express-validator`.
- Inserta los datos en la tabla `clases`.
- Redirige a la lista de clases (`/clases`).

---

### 4. Mostrar el formulario para editar una clase
**Ruta**: `GET /clases/edit/:id`  
**Descripción**: Muestra un formulario para editar los datos de una clase específica.  
**Detalles**:
- Obtiene la clase por su `id` desde la base de datos.
- Obtiene la lista de entrenadores para seleccionar un nuevo entrenador si es necesario.
- Renderiza la vista `clases/edit` con los datos actuales de la clase.

---

### 5. Editar una clase
**Ruta**: `POST /clases/edit/:id`  
**Descripción**: Actualiza los datos de una clase específica en la base de datos.  
**Detalles**:
- Valida los datos del formulario utilizando `express-validator`.
- Actualiza los campos en la tabla `clases` según el `id`.
- Redirige a la lista de clases (`/clases`).

---

### 6. Mostrar el formulario para eliminar una clase
**Ruta**: `GET /clases/del/:id`  
**Descripción**: Muestra un formulario de confirmación para eliminar una clase específica.  
**Detalles**:
- Obtiene los datos de la clase por su `id` desde la base de datos.
- Renderiza la vista `clases/del` con los datos de la clase.

---

### 7. Eliminar una clase
**Ruta**: `POST /clases/del/:id`  
**Descripción**: Elimina una clase específica de la base de datos.  
**Detalles**:
- Borra los datos de la clase según su `id` en la tabla `clases`.
- Redirige a la lista de clases (`/clases`).

---

### Errores manejados
En cada operación, se manejan errores comunes como:
- Fallos en la consulta a la base de datos.
- Clase no encontrada (para edición o eliminación).
- Validación de datos incorrectos en los formularios.

# IMPLEMENTACIÓN DE UN LOGIN

Para la implementación de un login hemos creado una carpeta middleware que contiene un archivo.js el cual se encarga de verificar si se ha accedido a la página con alguna "verificación" y sino te manda a verificarte

## auth.js

```java 
function isAuthenticated(req, res, next) {
    console.log(req.session); // Verifica que la sesión esté definida
    if (req.session.user) {
        return next();  // Si está autenticado, sigue al siguiente middleware
    }
    res.redirect('/auth/login');  // Si no está autenticado, redirige al login
}

```

Como ahora vamos a verificar y vamos a tener una sesion iniciada tenemos que hacer los mismos pasos anteriores pero con el usuario. Esto quiere decir que vamos a tener que crear unas vistas, unas rutas y un controller:

## VISTAS PUG DEL USUARIO (Auth)


### login.pug
 
```java 
extends ../templates/layout

block content
    div(class="container")
        h3 Iniciar sesión
        form(action="/auth/login", method="POST")
            div(class="form-group")
                label(for="nombre") Nombre:
                input(type="text", id="nombre", name="nombre", class="form-control", required=true)
            div(class="form-group")
                label(for="password") Contraseña:
                input(type="password", id="password", name="password", class="form-control", required=true)
            button(type="submit", class="btn btn-primary") Iniciar sesión
        p
            a(href="/auth/register") No tienes cuenta? Regístrate aquí
```

1. **Extensión del Layout**
   - La vista extiende la plantilla principal ubicada en `../templates/layout`, lo que garantiza que comparte el diseño general del sitio.

2. **Contenedor Principal**
   - El contenido del formulario está encapsulado en un `div` con la clase `container` para mantener la consistencia en el diseño y la estructura de la página.

3. **Título**
   - Se muestra un encabezado `h3` con el texto "Iniciar sesión" para indicar claramente la funcionalidad de la página.

4. **Campos del Formulario**
   - **Nombre**:
     - Campo de texto (`input[type="text"]`) obligatorio para ingresar el nombre del usuario.
   - **Contraseña**:
     - Campo de entrada de contraseña (`input[type="password"]`) obligatorio para ingresar la contraseña.

5. **Botón de Envío**
   - Botón principal (`button[type="submit"]`) con el texto "Iniciar sesión". Envía los datos del formulario mediante el método `POST` a la ruta `/auth/login`.

6. **Enlace de Registro**
   - Un párrafo (`p`) con un enlace (`a[href="/auth/register"]`) que redirige a la página de registro de usuarios con el texto "¿No tienes cuenta? Regístrate aquí".

### Flujo de Datos
- **Acción del formulario**: Envía los datos al servidor a la ruta `/auth/login` utilizando el método `POST`.
- **Validación del lado del cliente**: 
  - Los campos `nombre` y `password` son obligatorios gracias al atributo `required`.
- **Validación del lado del servidor**:
  - Se espera que el servidor procese y valide los datos para autenticar al usuario.


## register.pug

```java
extends ../templates/layout

block content
    div(class="container")
        h3 Registrarse
        form(action="/auth/register", method="POST")
            div(class="form-group")
                label(for="nombre") Nombre:
                input(type="text", id="nombre", name="nombre", class="form-control", required=true)
            div(class="form-group")
                label(for="password") Contraseña:
                input(type="password", id="password", name="password", class="form-control", required=true)
            button(type="submit", class="btn btn-primary") Registrarse
```
1. **Extensión del Layout**
   - La vista extiende la plantilla principal ubicada en `../templates/layout`, lo que asegura que la interfaz tenga el mismo diseño y estructura que el resto del sitio.

2. **Contenedor Principal**
   - El formulario está dentro de un `div` con la clase `container`, que es un contenedor utilizado para centrar y organizar el contenido.

3. **Título**
   - Un encabezado `h3` con el texto "Registrarse" para indicar claramente que el formulario es para la creación de una nueva cuenta.

4. **Campos del Formulario**
   - **Nombre**:
     - Campo de texto (`input[type="text"]`) obligatorio para que el usuario ingrese su nombre.
   - **Contraseña**:
     - Campo de entrada de contraseña (`input[type="password"]`) obligatorio para ingresar la contraseña del usuario.

5. **Botón de Envío**
   - Botón de tipo `submit` con el texto "Registrarse", que envía los datos del formulario al servidor utilizando el método `POST` a la ruta `/auth/register`.

### Flujo de Datos
- **Acción del formulario**: El formulario se envía al servidor en la ruta `/auth/register` mediante el método `POST`.
- **Validación del lado del cliente**: 
  - Los campos `nombre` y `password` son obligatorios gracias al atributo `required`.
- **Validación del lado del servidor**: El servidor recibirá los datos y deberá procesarlos para crear una nueva cuenta para el usuario.

## ROUTES DEL USUARIO (Auth)

```java
// routes/authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Asegúrate de que la ruta sea correcta

// Ruta para mostrar el login
router.get('/login', authController.mostrarLogin);

// Ruta para manejar el login
router.post('/login', authController.login);

// Ruta para mostrar el registro
router.get('/register', authController.mostrarRegistro);

// Ruta para manejar el registro
router.post('/register', authController.registro);

// Ruta para cerrar sesión
router.get('/logout', authController.logout); // Asegúrate de que `logout` esté definido en el controlador

module.exports = router;

```

### Rutas y sus Propósitos

1. **GET /auth/login**:
   - Muestra el formulario de inicio de sesión.
   - Utiliza el método `mostrarLogin` del `authController`.

2. **POST /auth/login**:
   - Procesa los datos del formulario de inicio de sesión.
   - Utiliza el método `login` del `authController` para autenticar al usuario.

3. **GET /auth/register**:
   - Muestra el formulario de registro de nuevos usuarios.
   - Utiliza el método `mostrarRegistro` del `authController`.

4. **POST /auth/register**:
   - Procesa los datos del formulario de registro.
   - Utiliza el método `registro` del `authController` para crear un nuevo usuario.

5. **GET /auth/logout**:
   - Cierra la sesión del usuario.
   - Utiliza el método `logout` del `authController` para terminar la sesión activa.

### Flujo de Datos
- **Login**: En las rutas `GET /login` y `POST /login`, el servidor maneja la visualización y la validación de las credenciales del usuario para autenticarlo.
- **Registro**: En las rutas `GET /register` y `POST /register`, el servidor permite crear una nueva cuenta de usuario y almacenar la información en la base de datos.
- **Logout**: La ruta `GET /logout` permite a los usuarios cerrar su sesión y se asegura de que la información de la sesión se elimine correctamente.

## CONTROLLER USUARIO(Auth)

```java
const bcrypt = require('bcrypt');
const db = require('../db');

// Mostrar el formulario de login
exports.mostrarLogin = (req, res) => {
    res.render('auth/login');  // Asegúrate de tener esta vista
};

// Función para procesar el login
exports.login = (req, res) => {
    const { nombre, password } = req.body;

    // Buscamos al usuario por su nombre
    const query = 'SELECT * FROM usuarios WHERE nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            return res.send('Error en la base de datos');
        }

        if (results.length > 0) {
            const user = results[0];
            
            // Comparamos la contraseña ingresada con la almacenada
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.send('Error en la comparación de contraseñas');
                }
                if (isMatch) {
                    req.session.user = user;  // Almacenamos el usuario en la sesión
                    return res.redirect('/');  // Redirigir al inicio
                } else {
                    return res.send('Credenciales incorrectas');
                }
            });
        } else {
            return res.send('No se encontró el usuario');
        }
    });
};

// Mostrar el formulario de registro
exports.mostrarRegistro = (req, res) => {
    res.render('auth/register');  // Asegúrate de tener esta vista
};

// Función para registrar un nuevo usuario
exports.registro = (req, res) => {
    const { nombre, password } = req.body;

    // Hash de la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.send('Error al cifrar la contraseña');

        // Insertamos el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (nombre, password) VALUES (?, ?)';
        db.query(query, [nombre, hashedPassword], (err, result) => {
            if (err) {
                return res.send('Error en la base de datos');
            }
            // Redirigimos al login después de registrar al usuario
            res.redirect('/auth/login');
        });
    });
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // Manejo de errores
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
        res.redirect('/'); // Redirigir a la página de inicio
    });
};
```

### Funciones del Controlador

1. **mostrarLogin**:
   - **Ruta**: `GET /auth/login`
   - **Descripción**: Muestra el formulario de inicio de sesión al usuario.
   - **Vista utilizada**: `auth/login`.

2. **login**:
   - **Ruta**: `POST /auth/login`
   - **Descripción**: Procesa el inicio de sesión. Compara las credenciales ingresadas con las almacenadas en la base de datos.
     - Si las credenciales son correctas, almacena el usuario en la sesión y redirige a la página principal.
     - Si las credenciales son incorrectas, muestra un mensaje de error.
   - **Flujo**:
     - Se busca al usuario en la base de datos por su nombre.
     - Se compara la contraseña ingresada con la almacenada en la base de datos usando **bcrypt**.
     - Si las contraseñas coinciden, el usuario se almacena en la sesión (`req.session.user`).
     - Si no coinciden, se muestra un mensaje de error.

3. **mostrarRegistro**:
   - **Ruta**: `GET /auth/register`
   - **Descripción**: Muestra el formulario de registro para crear un nuevo usuario.
   - **Vista utilizada**: `auth/register`.

4. **registro**:
   - **Ruta**: `POST /auth/register`
   - **Descripción**: Registra un nuevo usuario en el sistema.
     - Se cifra la contraseña con **bcrypt** antes de almacenarla en la base de datos.
     - Después de registrar al usuario, redirige a la página de inicio de sesión.
   - **Flujo**:
     - Se recibe el nombre y la contraseña del formulario.
     - La contraseña se cifra utilizando `bcrypt.hash`.
     - El usuario se inserta en la base de datos con el nombre y la contraseña cifrada.
     - Si todo es correcto, se redirige al formulario de inicio de sesión.

5. **logout**:
   - **Ruta**: `GET /auth/logout`
   - **Descripción**: Cierra la sesión del usuario.
     - Se destruye la sesión actual y se limpia la cookie de sesión.
     - Redirige al usuario a la página principal después de cerrar sesión.


Hay que añadir que hemos utilizado bycrypt para cifrar las contraseñas, para que las password almacenadas en la base de datos sean seguras.g

Te dejo por aqui tambien en enlace de nuestro repositorio git:
https://github.com/mcar03/GymGrupo13
