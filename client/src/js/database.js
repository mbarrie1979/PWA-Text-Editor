import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

export const putDb = async (content) => {
  console.log('PUT to the database', content);
  

  const db = await openDB('jate', 1);

 
  const tx = db.transaction('jate', 'readwrite');

  
  const store = tx.objectStore('jate');

  
  const request = store.put({ id: 1, value: content });

 
  const result = await request;
  console.log('🚀 - data saved to the database', result);
};


// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET all from the database');

  // Open a connection to the database
  const db = await openDB('jate', 1);

  // Create a transaction and specify the database and data privileges
  const tx = db.transaction('jate', 'readonly');

  // Open up the desired object store
  const store = tx.objectStore('jate');

  // Use the .getAll() method to get all data in the database
  const request = store.getAll();

  // Confirm the data was fetched
  const result = await request;
  console.log('🚀 - data fetched from the database', result);
  return result;
};


initdb();
