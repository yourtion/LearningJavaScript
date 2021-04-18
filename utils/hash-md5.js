const crypto = require('crypto');
const fs = require('fs');

async function md5(file) {
  return new Promise((resolve, reject) => {
    //从文件创建一个可读流
    const stream = fs.createReadStream(file);
    const fsHash = crypto.createHash('md5');
    stream.on('data', (d) => fsHash.update(d));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(fsHash.digest('hex')));
  });
}

md5('/tmp/1.txt').then(console.log);
