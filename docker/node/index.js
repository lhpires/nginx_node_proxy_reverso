const { faker } = require('@faker-js/faker');
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'laravel',
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

app.get('/', (req, res) => {
    const name = faker.internet.userName();
    
    const insertSql = `INSERT INTO people (name) VALUES ('${name}');`;
        
    connection.query(insertSql, (insertErr) => {
        if (insertErr) {
            console.error('Erro ao inserir no banco de dados:', insertErr);
            return res.status(500).send('Erro ao inserir o dado');
        }
        const selectSql = 'SELECT name FROM people;';
        
        connection.query(selectSql, (selectErr, results) => {
            if (selectErr) {
                console.error('Erro ao buscar os dados:', selectErr);
                return res.status(500).send('Erro ao buscar os dados');
            }

            //Monta o HTML com os resultados
            let responseHtml = '<h1>Full Cycle Rocks!</h1>';
            responseHtml += '<ul>';

            results.forEach(row => {
                responseHtml += `<li>${row.name}</li>`;
            });

            responseHtml += '</ul>';

            //Envia o HTML como resposta
            res.send(responseHtml);
        });
    });
});

app.listen(port,() => {
    console.log(`Rodando na porta ${port}`);
});
