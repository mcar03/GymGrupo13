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
  "dependencies": {
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "mysql2": "^3.11.4",
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