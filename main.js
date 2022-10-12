// Un ejemplo de cliente para invocar al API de https://www.uniprot.org

import prompt from 'prompt';
import 'dotenv/config.js';

//import allDatabases from './services/allDatabases.js';
import allFields from './services/allFields.js';
import search from './services/search.js';

import databaseUtils from './utils/databaseUtils.js';

const queryDefault = process.env.QUERY_DEFAULT;

prompt.start();

prompt.get([{
  name: 'query',
  description: 'Qué quieres buscar?',
  default: queryDefault,
  required: true
}], function (err, result) {
  if (err) console.log(`Ha ocurrido un error: ${err}`);
  else main(result.query);
});

async function main(query) {

  console.log('Recuperando todos (menos sequence) los campos de búsqueda posibles...');
  //const allUniprotFields = await allFields.getAllFields();
  const allUniprotFields = await allFields.getAllFieldsMinusSequence();
  console.log('Lanzando la búsqueda en la base de datos de UniProt...');
  await search.allSearchResultsToCsv(query, allUniprotFields);

  //let db = databaseUtils.openDatabase('./uniprot.db');
  //databaseUtils.getDistinctEntries(db);
  //databaseUtils.closeDatabase(db);

  console.log('Done :-)');

}
