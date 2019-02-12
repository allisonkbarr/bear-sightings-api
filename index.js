const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const { composeSqlWhereClause, getSortByClause } = require('./utils');

const app = express();
const port = 3000;
const db = new sqlite3.Database('bear_sightings.db');

const allowedKeys = ['bear_type', 'end_date', 'start_date', 'zip_code'];
const defaultSort = 'created_at';
const allowedSortParams = ['num_bears'];

app.use(bodyParser.json());

app.post('/sighting', async (req, res) => {
  const { bear_type, num_bears, zip_code, notes = '' } = req.body;
  db.run(
    'INSERT INTO sightings(bear_type, num_bears, zip_code, notes) VALUES(?, ?, ?, ?)',
    [bear_type, num_bears, zip_code, notes],
    function(error) {
      if (error) {
        console.log('Error from db: ', error);
        res.status(400).send('Error creating bear sighting record');
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.get('/sighting/search', (req, res) => {
  const { query } = req;
  const [whereClause, args] = composeSqlWhereClause(query, allowedKeys);
  const sortClause = getSortByClause(query, allowedSortParams, defaultSort);
  const sql = `SELECT * FROM sightings ${whereClause} ${sortClause}`;

  db.all(
    sql,
    args,
    function(error, rows) {
      if (error) {
        console.log('Error from db: ', error);
        res.status(400).send('Error fetching bear sighting records');
        return;
      }
      res.status(200).json(rows);
    }
  );
});

app.get('/sighting/:id', (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM sightings WHERE id = ?',
    [id],
    function(error, row) {
      if (error) {
        console.log('Error from db: ', error);
        res.status(404).send('Bear sighting record not found');
        return;
      }
      res.status(200).json(row);
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
