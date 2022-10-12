import axios from 'axios';
//import 'axios-debug-log/enable.js';
import 'dotenv/config.js';

const uniProtConfigUrl = process.env.UNIPROT_CONFIGURE_URL;
const userAgent = process.env.USER_AGENT;

/*
 * Invoca, utilizando la librería AXIOS, al API de la web de UniProt
 * para conseguir todos los campos de consulta disponibles en UniProt.
 */
async function getData() {
  const response = await axios.request({
    method: 'GET',
    url: uniProtConfigUrl + '/result-fields',
    headers: {
      'User-Agent': userAgent
    }
  });
  return response.data;
}

/*
 * Convierte todos los campos de consulta de la web de UniProt en un texto con todos los campos separados por ','.
 * Lo utilizaremos al invocar la búsqueda para que nos devuelva la máxima información posible.
 */
async function getAllFields() {
  const groups = await getData();
  let result = '';
  for (let group of groups) {
    for (let field of group.fields) {
      result += field.name + ',';
    }
  }
  return result;
}

/*
 * Convierte todos los campos de consulta de la web de UniProt en un texto con todos los campos separados por ','.
 * Evita el campo 'SEQUENCE' porque éste nos devuelve información que luego no nos interesa.
 * Lo utilizaremos al invocar la búsqueda para que nos devuelva la máxima información posible.
 */
async function getAllFieldsMinusSequence() {
  const groups = await getData();
  let result = '';
  for (let group of groups) {
    for (let field of group.fields) {
      if (field.name === 'sequence') ;
      else result += field.name + ',';
    }
  }
  return result;
}

export default {
  getAllFields,
  getAllFieldsMinusSequence
}
