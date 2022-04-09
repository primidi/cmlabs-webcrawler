const crawler = require('../services/index');

const router = require('express').Router();

router.get('/crawler', async (request, response) => {
  const { url } = request.query;
  try {
    const result = await crawler(url);
    response.status(200).send({
      result,
    });
  } catch (error) {
    response.send({
      message: error.message,
    });
  }
});

module.exports = router;