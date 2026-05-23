'use strict';

var http = require('http');
var fs   = require('fs');
var path = require('path');
var url  = require('url');

var PORT    = process.env.PORT || 3001;
var DB_PATH = path.join(__dirname, 'db.json');

/* ── db helpers ─────────────────────────────────────────────────────────── */

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

/* ── response helper ─────────────────────────────────────────────────────── */

function send(res, status, data) {
  var body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
  });
  res.end(body);
}

/* ── read POST/PUT body ──────────────────────────────────────────────────── */

function readBody(req, cb) {
  var chunks = [];
  req.on('data', function (chunk) { chunks.push(chunk); });
  req.on('end', function () {
    try {
      cb(null, JSON.parse(Buffer.concat(chunks).toString() || '{}'));
    } catch (e) {
      cb(e);
    }
  });
  req.on('error', cb);
}

/* ── request handler ─────────────────────────────────────────────────────── */

var server = http.createServer(function (req, res) {

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  var parsed   = url.parse(req.url, true);
  var pathname = parsed.pathname;

  // Match /api/v1/:resource  or  /api/v1/:resource/:id
  var match = pathname.match(/^\/api\/v1\/([^\/]+)(?:\/([^\/]+))?$/);
  if (!match) {
    send(res, 404, { error: 'Not found' });
    return;
  }

  var resource = match[1];   // e.g. "flights" or "aircraft"
  var id       = match[2];   // e.g. "3", or undefined

  /* ── GET ── */
  if (req.method === 'GET') {
    var db = readDb();
    if (!db[resource]) return send(res, 404, { error: 'Unknown resource' });
    if (id) {
      var item = db[resource].filter(function (x) {
        return String(x.id) === String(id);
      })[0];
      return send(res, item ? 200 : 404, item || { error: 'Not found' });
    }
    return send(res, 200, db[resource]);
  }

  /* ── POST ── */
  if (req.method === 'POST') {
    readBody(req, function (err, body) {
      if (err) return send(res, 400, { error: 'Invalid JSON' });
      var db    = readDb();
      if (!db[resource]) return send(res, 404, { error: 'Unknown resource' });
      var items = db[resource];
      var maxId = items.reduce(function (m, x) {
        return Math.max(m, parseInt(x.id, 10) || 0);
      }, 0);
      body.id = String(maxId + 1);
      items.push(body);
      writeDb(db);
      send(res, 201, body);
    });
    return;
  }

  /* ── PUT ── */
  if (req.method === 'PUT') {
    if (!id) return send(res, 400, { error: 'ID required' });
    readBody(req, function (err, body) {
      if (err) return send(res, 400, { error: 'Invalid JSON' });
      var db    = readDb();
      if (!db[resource]) return send(res, 404, { error: 'Unknown resource' });
      var items = db[resource];
      var idx   = -1;
      items.forEach(function (x, i) { if (String(x.id) === String(id)) idx = i; });
      if (idx === -1) return send(res, 404, { error: 'Not found' });
      body.id   = id;
      items[idx] = body;
      writeDb(db);
      send(res, 200, items[idx]);
    });
    return;
  }

  /* ── PATCH ── */
  if (req.method === 'PATCH') {
    if (!id) return send(res, 400, { error: 'ID required' });
    readBody(req, function (err, body) {
      if (err) return send(res, 400, { error: 'Invalid JSON' });
      var db    = readDb();
      if (!db[resource]) return send(res, 404, { error: 'Unknown resource' });
      var items = db[resource];
      var idx   = -1;
      items.forEach(function (x, i) { if (String(x.id) === String(id)) idx = i; });
      if (idx === -1) return send(res, 404, { error: 'Not found' });
      Object.keys(body).forEach(function (k) { items[idx][k] = body[k]; });
      writeDb(db);
      send(res, 200, items[idx]);
    });
    return;
  }

  /* ── DELETE ── */
  if (req.method === 'DELETE') {
    if (!id) return send(res, 400, { error: 'ID required' });
    var db    = readDb();
    if (!db[resource]) return send(res, 404, { error: 'Unknown resource' });
    var items = db[resource];
    var idx   = -1;
    items.forEach(function (x, i) { if (String(x.id) === String(id)) idx = i; });
    if (idx === -1) return send(res, 404, { error: 'Not found' });
    items.splice(idx, 1);
    writeDb(db);
    send(res, 200, {});
    return;
  }

  send(res, 405, { error: 'Method not allowed' });
});

/* ── startup ─────────────────────────────────────────────────────────────── */

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('  ERROR: port ' + PORT + ' is already in use.');
    console.error('  Run:   lsof -ti :' + PORT + ' | xargs kill -9');
    console.error('  Then:  npm run dev');
    console.error('');
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, function () {
  console.log('');
  console.log('  JSON Server is running');
  console.log('  PORT : ' + PORT);
  console.log('  URL  : http://localhost:' + PORT + '/api/v1/flights');
  console.log('  URL  : http://localhost:' + PORT + '/api/v1/aircraft');
  console.log('');
});
