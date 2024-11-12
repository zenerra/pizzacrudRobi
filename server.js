const express = require('express');
const cors = require('cors'); // cors importálva
const app = express();
app.use(cors()); // cors használata az összes útvonalhoz
//  Ez lehetővé teszi, hogy a szerver elfogadja a kéréseket 
//különböző eredetű domainekről (pl ha egy frontend 
//alkalmazás egy másik domain-en vagy port-on fut)

app.use(express.json()); // middleware - JSON típusú adatok fogadásához
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "pizza"
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return; // Ha hiba van, akkor kilépünk a programból
    }
    console.log('Kapcsolódva az adatbázishoz.');
});
//osszes pizza lekérdezése
app.get('/pizza', (req, res) => {
    let sql = 'SELECT pazon,pnev,par FROM pizza';
    connection.query(sql, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return; // Ha hiba van, akkor kilépünk a programból
        }
        res.send(rows);
    }); 
});
//lekérdezés
app.get('/pizza/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT pazon,pnev,par FROM pizza WHERE pazon = ?';
    let sqlParams = [id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return; // Ha hiba van, akkor kilépő a programból
        }
        res.send(rows);
    });
})
//új pizza felvétele
app.post('/pizza', (req, res) => {
    let uj = req.body;
    let sql = 'INSERT INTO pizza (pazon, pnev, par) VALUES (NULL,?,?)'; //-- pazon autoincrement!
    let sqlParams = [uj.pnev, uj.par];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return; // Ha hiba van, akkor kilépő a programból
        }
        let lastInsertId = rows.insertId;
        res.status(201).send(lastInsertId, rows.pnev, rows.par);
    });
});
//pizza módosítása
app.put('/pizza/:id', (req, res) => {
    let id = req.params.id;
    let uj = req.body;
    let sql = 'UPDATE pizza SET pnev = ?, par = ? WHERE pazon = ?';
    let sqlParams = [uj.pnev, uj.par, id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return; // Ha hiba van, akkor kilép a programból
        }
        res.status(201).send(rows);
    });
});
//pizza törlése
app.delete('/pizza/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM pizza WHERE pazon = ?';
    let sqlParams = [id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return; // Ha hiba van, akkor kilép a programból
        }
        res.status(201).send(rows);
    });
});
app.listen(3000, () => {
    console.log('A szerver elindult a 3000-es porton.');
});