const jsonServer = require('json-server');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Allow requests from any origin (Vercel frontend, local dev, etc.)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(middlewares);

// All routes are served under /api/v1
// GET  /api/v1/flights
// GET  /api/v1/flights/:id
// POST /api/v1/flights
// PUT  /api/v1/flights/:id
// DELETE /api/v1/flights/:id
// GET  /api/v1/aircraft
app.use('/api/v1', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});
