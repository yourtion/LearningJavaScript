const http = require('http');
const fs = require('fs');

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = http
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => resolve(dist));
      })
      .on('error', (err) => {
        // Handle errors
        // Delete the file async. (But we don't check the result)
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

download('http://baidu.com', '/tmp/1.txt').then(console.log);
