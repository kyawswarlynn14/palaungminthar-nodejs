import express from "express";
import mysql from 'mysql'
import cors from 'cors'
import multer from 'multer'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM shop";
    db.query(sql, (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.post('/shop', upload.single('photo'), (req, res) => {
  const sql = 'INSERT INTO shop (`Name`, `Description`, `Price`, `Photo`) VALUES (?, ?, ?, ?)';
  const values = [req.body.name, req.body.description, req.body.price, req.file.filename]; // Save the file name in the database

  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});


app.get('/read/:id', (req, res) => {
    const sql = "SELECT * FROM shop WHERE ID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.put('/update/:id', (req, res) => {
    const sql = 'UPDATE shop SET `Name`=?, `Description`=?, `Price`=? WHERE ID=?';
    const id = req.params.id;
    
    db.query(sql, [req.body.name, req.body.description, req.body.price, id], (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM shop WHERE ID=?";
    const id = req.params.id;
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.listen(8081, () => {
    console.log("Listening")
})
