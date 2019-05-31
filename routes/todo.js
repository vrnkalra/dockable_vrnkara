var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/list', function (req, res, next) {
  res.send({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [{
      "text": "<li>Partly cloudy today and tomorrow</li>",
    }]
  })
});

router.post('/add', function (req, res, next) {
  res.send({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [{
      "text": "Partly cloudy today and tomorrow"
    }]
  })
});

router.post('/mark', function (req, res, next) {
  res.send({
    "response_type": "in_channel",
    "text": "It's 80 degrees right now.",
    "attachments": [{
      "text": "Partly cloudy today and tomorrow"
    }]
  })
});

module.exports = router;