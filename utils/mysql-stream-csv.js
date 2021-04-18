const mysql = require('mysql2');
const { Transform } = require('stream');

function csvStringParser(str, sep = ',') {
  const c = new RegExp(sep, 'g');
  const q = new RegExp('"', 'g');
  const n = new RegExp(/\n|\r/, 'g');
  let item = str;
  if (str === 0) {
    return '0';
  } else if (str === undefined || str === null) {
    return '';
  }
  if (typeof item !== 'string') {
    const s = item.toString();
    if (s === '[object Object]') {
      item = JSON.stringify(item);
      if (item === '{}') {
        return '';
      }
    } else {
      item = s;
    }
  }
  if (item.search(c) >= 0 || item.search(q) >= 0 || item.search(n) >= 0) {
    return '"' + item.replace(q, '""').replace(n, '') + '"';
  }
  return item + '';
}

// All Transform streams are also Duplex Streams.
const csvTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    const arr = Object.keys(chunk).map((key) => chunk[key]);
    const data = arr.map((item) => csvStringParser(item)).join(',') + '\n';
    callback(null, data);
  },
});

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'wb',
});

const stream = connection.query('SELECT * FROM `table`').stream();
stream.pipe(csvTransform).pipe(process.stdout);

stream.on('end', () => {
  process.exit(0);
});
