const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware para processar os dados POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Rota de registro
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Verifica se o usuário já existe
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));
  if (users.find(user => user.username === username)) {
    return res.send('Usuário já existe!');
  }

  // Criptografa a senha
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.send('Erro ao criar a conta');
    }

    // Cria o novo usuário
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    // Salva o novo usuário no arquivo JSON
    fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users));

    res.send('Conta criada com sucesso!');
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));
  const user = users.find(user => user.username === username);
  
  if (!user) {
    return res.send('Usuário ou senha inválidos');
  }

  // Verifica a senha
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      res.redirect('/dashboard.html'); // Redireciona para o dashboard
    } else {
      res.send('Usuário ou senha inválidos');
    }
  });
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Página de registro
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Página do dashboard
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/index.html`);
});
