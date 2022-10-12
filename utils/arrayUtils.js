/*
 * Devuelve la lista de valores diferentes que tiene un array de objetos para el campo 'theField' indicado.
 */
function getUniqElementsOfArray(theArray, theField) {
  if (!theArray) return [];
  if (!Array.isArray(theArray)) return [];
  // Si 'theArray' es un array, devuelvo los diferentes valores del 'theField' indicado
  return [...new Set(theArray.filter(p => p[theField] && p[theField].trim()).map(p => p[theField]))];
}

export default {
  getUniqElementsOfArray
}