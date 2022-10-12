import arrayUtils from '../utils/arrayUtils.js';

/*
 * Recuperamos el RV de la entrada (está en los genes)
 */
function getRv(searchResult) {
  const rv = [];
  if (Array.isArray(searchResult?.genes)) {
    for (let gen of searchResult.genes) {
      if (Array.isArray(gen?.orderedLocusNames)) {
        for (let ordered of gen.orderedLocusNames) {
          if (ordered.value.toUpperCase().indexOf('RV') >= 0) {
            rv.push(ordered.value); 
          }
        }
      } 
    }
  }
  return [...new Set(rv)]; // Este truco es para conseguir los valores únicos
}

/*
 * Recuperamos la lista de ecNumbers en los diferentes lugares de la descrición de la proteina
 */
function getEcvalue(searchResult) {
  const ecvalue = [];
  // Primero busco en los 'recommendedName'
  ecvalue.push(arrayUtils.getUniqElementsOfArray(searchResult?.proteinDescription?.recommendedName?.ecNumbers, 'value'));
  // Luego busco en los 'includes' (que es, de nuevo, un array de objetos)
  if (Array.isArray(searchResult?.proteinDescription?.includes)) {
    for (let include of searchResult.proteinDescription.includes) {
      ecvalue.push(arrayUtils.getUniqElementsOfArray(include?.recommendedName?.ecNumbers, 'value'));    
    }
  }
  return [...new Set(ecvalue)]; // Este truco es para conseguir los valores únicos
}

export default {
  getRv,
  getEcvalue
}