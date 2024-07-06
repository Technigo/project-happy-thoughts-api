const express = require('express');
const router = express.Router();

// Middleware per gestire il middleware "anonymous"
function anonymousMiddleware(req, res, next) {
  // Esempio di middleware che gestisce l'anonimato
  console.log('Anonymous middleware');
  next(); // Passa al middleware successivo o alla route
}

// Route per l'endpoint '/'
router.get('/', anonymousMiddleware, (req, res) => {
  res.json([
    {
      "path": "/",
      "methods": [
        "GET"
      ],
      "middleware": [
        "anonymous"
      ]
    }
  ]);
});

// Route per l'endpoint '/thoughts'
router.route('/thoughts')
  .get(anonymousMiddleware, (req, res) => {
    res.json([
      {
        "path": "/thoughts",
        "methods": [
          "GET"
        ],
        "middleware": [
          "anonymous"
        ]
      }
    ]);
  })
  .post(anonymousMiddleware, (req, res) => {
    res.json([
      {
        "path": "/thoughts",
        "methods": [
          "POST"
        ],
        "middleware": [
          "anonymous"
        ]
      }
    ]);
  });

// Route per l'endpoint '/thoughts/:id/like'
router.post('/thoughts/:id/like', anonymousMiddleware, (req, res) => {
  res.json([
    {
      "path": "/thoughts/:id/like",
      "methods": [
        "POST"
      ],
      "middleware": [
        "anonymous"
      ]
    }
  ]);
});

module.exports = router;
