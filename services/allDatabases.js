import axios from 'axios';
//import 'axios-debug-log/enable.js';
import 'dotenv/config.js';

const uniProtConfigUrl = process.env.UNIPROT_CONFIGURE_URL;
const userAgent = process.env.USER_AGENT; 

/*
 * Invoca, utilizando la librería AXIOS, al API de la web de UniProt
 * para conseguir todas las bases de datos de consulta disponibles en UniProt.
 */
async function getData() {
  const response = await axios.request({
    method: 'GET',
    url: uniProtConfigUrl + '/allDatabases',
    headers: {
      'User-Agent': userAgent
    }
  });
  return response.data;
}

/*
 * Convierte todas las bases de datos disponibles en la web de UniProt en un texto con formato CSV.
 * Sólo con finalidad de aprender el uso del API.
 */
async function allDatabasesToCsv() {
  const databases = await getData();
  let csv = '';
  for (let database of databases) {
    csv +=
      '"' + database.name + '";' + 
      '"' + database.displayName + '";' +
      '"' + database.category + '";';
    for (let attribute of database.attributes) {
      csv += '"' + attribute.name + ' (' + attribute.xmlTag + ')";';
    }
    csv += '\n';
  }
  return csv;
}

/*
 * Convierte todas las bases de datos disponibles en la web de UniProt en un texto con formato de tabla HTML.
 * Sólo con finalidad de aprender el uso del API.
 */
async function allDatabasesToTable() {
  const databases = await getData();
  let table = '<table>';
  for (let database of databases) {
    table +=
      '<tr>' +
      '<td>' + database.name + '</td>' + 
      '<td>' + database.displayName + '</td>' +
      '<td>' + database.category + '</td>';
    for (let attribute of database.attributes) {
      table += '<td>' + attribute.name + ' (' + attribute.xmlTag + ')</td>';
    }
    table += '</tr>';
  }
  table += '</table>';
  return `
    <div>
      <p>He encontrado ${databases.length} elementos en la invocación al end-point 'allDatabases'.</p>    
      ${table}
    </div>
  `;
}

export default {
  allDatabasesToCsv,
  allDatabasesToTable
}
