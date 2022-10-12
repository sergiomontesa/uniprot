import sqlite3 from 'sqlite3';

sqlite3.verbose();

function openDatabase(filename) {
  let db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.log(`Ha ocurrido un error: ${err}`);
    console.log('Conectado a la base de datos de Uniprot.');
  });
  return db;
}

function getDistinctEntries(db) {
  db.serialize(() => {
    db.each(`select distinct PRIMARYACCESSION from SEARCH order by 1`, (err, row) => {
      if (err) console.log(`Ha ocurrido un error: ${err}`);
      console.log(row);
    });
  });
}

function closeDatabase(db) {
  db.close((err) => {
    if (err) console.log(`Ha ocurrido un error: ${err}`);
    console.log('La base de datos de Uniprot se ha cerrado.');
  });
}

export default {
  openDatabase,
  getDistinctEntries,
  closeDatabase
}