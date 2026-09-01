// Servidor estático mínimo para Railway. Sin dependencias.
// Localmente el juego se sigue sirviendo con el servidor del panel;
// este archivo solo se usa en el deploy.
var http = require('http');
var fs = require('fs');
var path = require('path');

var RAIZ = __dirname;
var PUERTO = process.env.PORT || 3000;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

http.createServer(function (req, res) {
  var url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';

  var archivo = path.normalize(path.join(RAIZ, url));
  if (archivo.indexOf(RAIZ) !== 0) {
    res.writeHead(403);
    return res.end('Prohibido');
  }

  fs.readFile(archivo, function (err, datos) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('No encontrado');
    }
    var ext = path.extname(archivo).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(datos);
  });
}).listen(PUERTO, '0.0.0.0', function () {
  console.log('Fundadores escuchando en el puerto ' + PUERTO);
});
