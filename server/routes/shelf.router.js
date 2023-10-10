const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * Get all of the items on the shelf
 */

router.get('/', (req, res) => {
  console.log('/pet GET route');
  console.log('is authenticated?', req.isAuthenticated());
  if(req.isAuthenticated()) {
      console.log('user', req.user);
      let queryText = `SELECT * FROM "item" WHERE "user_id" = $1;`;
      pool.query(queryText, [req.user.id]).then((result) => {
          res.send(result.rows);
      }).catch((error) => {
          console.log(error);
          res.sendStatus(500);
      });
  } else {
      res.sendStatus(401);
  }
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', (req, res) => {
  
console.log('is authenticated?', req.isAuthenticated());
  if(req.isAuthenticated()) {
      console.log('user', req.user);
      let queryText = `INSERT INTO "item" (description, image_url, user_id)
      VALUES ($1, $2, $3) RETURNING id`;
      pool.query(queryText, [req.body.description, req.body.imageUrl, req.user.id])
          .then(results => {
              res.sendStatus(201);
          }).catch(error => {
              console.log(error);
              res.sendStatus(500);
          });
  } else {
      res.sendStatus(401);
  }
});

/**
 * Delete an item
 */
router.delete('/:id', (req, res) => {
    pool.query('DELETE FROM "item" WHERE id=$1', [req.params.id]).then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('Error DELETE', error);
        res.sendStatus(500);
    })
});

module.exports = router;
