// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      // Check if data is an array and convert it to a string if necessary
      let valueToSet = '';
      if (Array.isArray(data) && data.length) {
        // Assuming the object has a property that contains the text you want to edit
        valueToSet = data[0].text; // Adjust 'text' based on your object's actual structure
      } else if (typeof data === 'string') {
        valueToSet = data;
      } else {
        valueToSet = localData || header;
      }

      // Ensure the value is a string
      this.editor.setValue(valueToSet.toString());
    }).catch((error) => {
      console.error('Failed to load data from IndexedDB:', error);
      this.editor.setValue(header);
    });


    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
