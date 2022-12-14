import fs from 'fs';
import axios from 'axios';
//import 'axios-debug-log/enable.js';
import 'dotenv/config.js';
import jsonexport from 'jsonexport'; //Ver: https://www.npmjs.com/package/jsonexport

import entryUtils from '../utils/entryUtils.js';
import stringUtils from '../utils/stringUtils.js';

const uniProtUrl = process.env.UNIPROT_URL;
const userAgent = process.env.USER_AGENT;
const resultSize = process.env.RESULT_SIZE;
const defaultConfigureFields = process.env.DEFAULT_CONFIGURE_FIELDS;
const defaultFields = process.env.DEFAULT_FIELDS;

const regenerarSearchCsv = false;
const nombreFicheroSearchCsv = 'uniProt-search.csv';
const nombreFicheroTfgCsv = 'uniProt-tfg.csv';

async function getCountSearchResults(query) {
  const response = await axios.request({
    method: 'GET',
    url: uniProtUrl + '/search',
    headers: {
      'User-Agent': userAgent
    },
    params: {
      'facets': defaultConfigureFields,
      'query': '("' + query + '")',
      'size': 0
    }
  });
  const reviewed = response.data.facets[0].values[0].count;
  const unreviewed = response.data.facets[0].values[1].count;
  const total = reviewed + unreviewed;
  return total;
}

async function getEntryResults(primaryAccession) {
  const response = await axios.request({
    method: 'GET',
    url: uniProtUrl + '/' + primaryAccession + '.json',
    headers: {
      'User-Agent': userAgent
    }});
  return response.data;
}

async function getNextSearchResults(link) {
  const response = await axios.request({
    method: 'GET',
    url: link,
    headers: {
      'User-Agent': userAgent
    }});
  return { results: response.data.results, next: response.headers.link };
}

async function getSearchResults(query, fields) {
  const response = await axios.request({
    method: 'GET',
    url: uniProtUrl + '/search',
    headers: {
      'User-Agent': userAgent
    },
    params: {
      'fields': fields,
      'query': '("' + query + '")',
      'size': resultSize
    }
  });
  return { results: response.data.results, next: response.headers.link };
}

async function allSearchResultsToCsv(query, fields = defaultFields) {

  if (regenerarSearchCsv) {
    console.log(`Borrando el fichero (si existe) '${nombreFicheroSearchCsv}' antes de crear uno nuevo...`);
    fs.unlink('./' + nombreFicheroSearchCsv, (err) => {
      if (err) {
        console.log(`Ha ocurrido un error: ${err}`);
        return;
      }
    });
    fs.appendFile('./' + nombreFicheroSearchCsv, '"PRIMARYACCESSION";"FAD";"FMN";"F420";"FAD o FMN o F420";"FIELD";"VALUE"\n', err => {
      if (err) console.log(`Ha ocurrido un error: ${err}`);
    });
  }

  console.log(`Borrando el fichero (si existe) '${nombreFicheroTfgCsv}' antes de crear uno nuevo...`);
  fs.unlink('./' + nombreFicheroTfgCsv, (err) => {
    if (err) {
      console.log(`Ha ocurrido un error: ${err}`);
      return;
    }
  });
  fs.appendFile('./' + nombreFicheroTfgCsv, '"PRIMARYACCESSION";"RV";"EC"\n', err => {
    if (err) console.log(`Ha ocurrido un error: ${err}`);
  });

  // Contamos cuántas entradas coinciden con la query buscada y calculamos las páginas
  const countSearchResults = await getCountSearchResults(query);
  console.log(`Entre revisados y no revisados hay un total de ${countSearchResults} resultados.`)
  const pages = Math.ceil(countSearchResults / resultSize);

  let csv = '';
  let entradasFiltradas = 0;
  let next = '';
  let voyPorLaEntrada = 0;

  for (let i = 1 ; i <= pages; i++) {

    console.log(`Buscando la página ${i} de un total de ${pages} páginas...`);

    // Si es la primera página lanzo la query en caso contrario la siguiente página está en la
    // cabecera HTTP 'link' (página mediante la técnica de cursores)
    let allSearchResults = null;
    if (i === 1) {
      allSearchResults = await getSearchResults(query, fields);
    } else allSearchResults = await getNextSearchResults(next);
    if (pages > 1 && i < pages) next = allSearchResults.next.replace('<https://', 'https://').replace('>; rel="next"', '');

    for (let searchResult of allSearchResults.results) {

      /*
      // En caso de querer invocar entrada por entrada (son 4083 peticiones)
      voyPorLaEntrada++;
      let entrySearchResults = await getEntrySearchResults(searchResult.primaryAccession);
      await new Promise(resolve => setTimeout(resolve, 500)); // Espero medio segundo, para que no me baneen
      if (voyPorLaEntrada % 25 === 0) console.log(`Voy por la entrada ${voyPorLaEntrada}...`);
      let todaLaEntrada = JSON.stringify(entrySearchResults);
      */

      //if (searchResult.primaryAccession === 'P9WG57') console.log(JSON.stringify(searchResult));

      // Voy a buscar [ FAD | FMN | F420 ] en el resultado de la búsqueda
      let todaLaEntrada = JSON.stringify(searchResult);
      if (todaLaEntrada.indexOf("FAD") >= 0 ||
          todaLaEntrada.indexOf("FMN") >= 0 ||
          todaLaEntrada.indexOf("F420") >= 0) {

        entradasFiltradas++;
        console.log(`He encontrado ${entradasFiltradas} entradas con [ FAD | FMN | F420 ]...`);

        const rv = entryUtils.getRv(searchResult);
        const ecvalue = entryUtils.getEcvalue(searchResult);

        if (regenerarSearchCsv) {

          // Convertimos el JSON en un CSV (añadiendo los campos calculados anteriormente y alguna fórmula EXCEL)
          let csvCalculadoSearch = '';
          /*A*/ csvCalculadoSearch += '"' + searchResult.primaryAccession + '";'; //PRIMARYACCESSION=IZQUIERDA(F2; ENCONTRAR("."; H2; 1) - 1)
          /*B*/ csvCalculadoSearch += '"=SI(ESNUMERO(ENCONTRAR(""FAD"";G2));""SI"";"""")";';
          /*C*/ csvCalculadoSearch += '"=SI(ESNUMERO(ENCONTRAR(""FMN"";G2));""SI"";"""")";';
          /*D*/ csvCalculadoSearch += '"=SI(ESNUMERO(ENCONTRAR(""F420"";G2));""SI"";"""")";';
          /*E*/ csvCalculadoSearch += '"=SI(O(IGUAL(B2;""SI"");IGUAL(C2;""SI"");IGUAL(D2;""SI""));""SI"";"""")";';
          /*F = FIELD */
          /*G = VALUE */

          jsonexport(searchResult, { rowDelimiter: ';', forceTextDelimiter: true, mainPathItem: csvCalculadoSearch, arrayPathString: ',' }, function(err, csv) {
            if (err) console.log(`Ha ocurrido un error: ${err}`);
            else {
              fs.appendFile('./' + nombreFicheroSearchCsv, csv + "\n", err => {
                if (err) console.log(`Ha ocurrido un error: ${err}`);
              });
            }
          });

        }

        // Convertimos el JSON en un CSV (añadiendo los campos calculados anteriormente y alguna fórmula EXCEL)
        let csvCalculadoTfg = '';
        /*A*/ csvCalculadoTfg += '"' + searchResult.primaryAccession + '";';
        /*B*/ csvCalculadoTfg += '"' + rv + '";';
        /*C*/ csvCalculadoTfg += '"' + ecvalue + '";';

        fs.appendFile('./' + nombreFicheroTfgCsv, csvCalculadoTfg + "\n", err => {
          if (err) console.log(`Ha ocurrido un error: ${err}`);
        });

      } // fin-if

    } // fin-for de resultados de una página

  } // fin-for de páginas

}

export default {
  allSearchResultsToCsv
}
