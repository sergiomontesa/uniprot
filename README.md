# uniprot

Un ejemplo de cliente para invocar al API de [UniProt](https://www.uniprot.org).

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm install`

Para instalar todas las dependencias que necesita el proyecto: axios, dotenv, jsonexport, prompt, sqlite3,...

### `npm run uniprot`

Para invocar el comando que te solicitará una cadena de búsqueda (o query), presentando por defecto la de nuestro proyecto TFG, y luego rastrea en la web de UniProt para localizar las entradas que coincidan con esa búsqueda, generando un fichero CSV.
