const express = require('express');

const app = express();
const port = 1987;

const crawler = require('./routes/router');

app.get('/', async (request, response) => {
  response.send('Welcome to Web Crawler (cmlabs assessment).');
});

app.use('/api', crawler);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});