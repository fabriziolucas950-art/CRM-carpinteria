const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const cwd = process.cwd();

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]; // Remove query string
    let filePath = path.join(cwd, urlPath === '/' ? 'index.html' : urlPath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        let contentType = 'text/html';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        if (filePath.endsWith('.js')) contentType = 'text/javascript';
        if (filePath.endsWith('.json')) contentType = 'application/json';
        if (filePath.endsWith('.png')) contentType = 'image/png';
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
        if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/index.html`);
});
