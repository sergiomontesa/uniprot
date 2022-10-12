// Es una función recursiva que intenta generar un Csv recorriendo todos los niveles de un Json
//TODO: no funciona bien :-(

function jsonToCsv1(searchResult, paramName = "", csv = "") {
  if (searchResult) {
    const keys = Object.keys(searchResult);
    for (let key of keys) {
      if (typeof searchResult[key] === 'string' || typeof searchResult[key] === 'number' || typeof searchResult[key] === 'boolean') {
        paramName += (paramName.length > 0 ? '.' : '') + key;
        csv += '"' + paramName + '=' + searchResult[key] + '";';
      } else if (Array.isArray(searchResult[key])) {
        for (let ikey of searchResult[key]) {
          if (typeof ikey === 'string' || typeof ikey === 'number'|| typeof ikey === 'boolean') {
            //paramName += (paramName.length > 0 ? '.' : '') + key;
            csv += '"' + paramName + '=' + ikey + '";';
          } else if (typeof ikey === 'object') {
            csv = jsonToCsv(ikey, paramName, csv);
          } else console.log(ikey + ' -> ' + typeof ikey);
        }
      } else if (typeof searchResult[key] === 'object') {
        csv = jsonToCsv(searchResult[key], paramName, csv);
      } else console.log(key + ' -> ' + typeof searchResult[key]);
    }
  }
  return csv;
}

//TODO: de momento esta función no sirve para nada (es sólo una prueba)

function jsonToCsv2(headers, searchResult) {
  let csv = '';
  for (let header of headers) {
    const headerSplit = header.split('.');
    try {
      if (headerSplit.length >= 1 && Array.isArray(searchResult[headerSplit[0]]) && typeof searchResult[headerSplit[0]] === 'object') console.log(headerSplit[0] + ' es un Array de objetos :-(');
      if (headerSplit.length >= 2 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]]) && typeof searchResult[headerSplit[0]][headerSplit[1]] === 'object') console.log(headerSplit[0] + "." + headerSplit[1] + ' es un Array de objetos :-(');
      if (headerSplit.length >= 3 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]]) && typeof searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]] === 'object') console.log(headerSplit[0] + "." + headerSplit[1] + "."+  headerSplit[2] + ' es un Array de objetos :-(');
      if (headerSplit.length >= 4 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]]) && typeof searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]] === 'object') console.log(headerSplit[0] + "." + headerSplit[1] + "." + headerSplit[2] + "." + headerSplit[3] + ' es un Array de objetos :-(');
      if (headerSplit.length >= 5 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]]) && typeof searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]] === 'object') console.log(headerSplit[0] + "." + headerSplit[1] + "." + headerSplit[2] + "." + headerSplit[3] + "." + headerSplit[4] + ' es un Array de objetos :-(');
      if (headerSplit.length >= 6 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]][headerSplit[5]]) && typeof searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]][headerSplit[5]] === 'object') console.log(headerSplit[0] + "." + headerSplit[1] + "." + headerSplit[2] + "." + headerSplit[3] + "." + headerSplit[4] + "." + headerSplit[5] + ' es un Array de objetos :-(');
      /*
      if (headerSplit.length === 1 && Array.isArray(searchResult[headerSplit[0]])) console.log(header + ' es un Array :-(');
      else if (headerSplit.length === 2 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]])) console.log(header + ' es un Array :-(');
      else if (headerSplit.length === 3 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]])) console.log(header + ' es un Array :-(');
      else if (headerSplit.length === 4 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]])) console.log(header + ' es un Array :-(');
      else if (headerSplit.length === 5 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]])) console.log(header + ' es un Array :-(');
      else if (headerSplit.length === 6 && Array.isArray(searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]][headerSplit[5]])) console.log(header + ' es un Array :-(');
      */
      if (headerSplit.length === 1) csv += '"' + searchResult[headerSplit[0]] + '";';
      else if (headerSplit.length === 2) csv += '"' + searchResult[headerSplit[0]][headerSplit[1]] + '";';
      else if (headerSplit.length === 3) csv += '"' + searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]] + '";';
      else if (headerSplit.length === 4) csv += '"' + searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]] + '";';
      else if (headerSplit.length === 5) csv += '"' + searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]] + '";';
      else if (headerSplit.length === 6) csv += '"' + searchResult[headerSplit[0]][headerSplit[1]][headerSplit[2]][headerSplit[3]][headerSplit[4]][headerSplit[5]] + '";';
    } catch (err) {
      csv += '"";';
      //console.log(`Ha ocurrido un error ${err} con ${header}`);
    }
  }
  return csv.replace(/undefined/g, '') + '\n';
}

export default {
  jsonToCsv1,
  jsonToCsv2
}