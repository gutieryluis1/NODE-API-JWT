//Criando uma API de autenticação usando express e JsonWebToken

//iMPORTANDO O JWT E O EXPRESS
const express = require('express')
const jwt = require('jsonwebtoken')
//CRIANDO SUA APP
const app = express()
//DANDO UM GET ONDE ELE RETORNA UM JSON
app.get('/api', (req, res) => {
    res.json({
        text: 'Welcome to my API!'
    })
})
//DANDO UM POST ONDE ELE VAI GERAR SEU TOKEN DE ACESSO
app.post('/api/login', (req, res) => {
    //auth user
    const user = { id: 3 }
    const token = jwt.sign({ user }, 'my_secret_key')

    res.json({
        token: token
    })
})
/*AQUI ELE CRIA UMA FUNÇÃO E UM VERIFICADOR COM DOIS PARÂMETROS QUE SÓ VAI DEIXAR
ELE LOGAR SE ELE FOR AUTENTICADO COM O TOKEN GERADO NO POST ACIMA.
CASO ELE COLOQUE UM TOKEN ERRADO NO HEADER "AUTHORIZATION", SERÁ EXIBIDO NA TELA UM FORBIDDEN(403), CASO 
CONTRÁRIO, ELE SERÁ AUTENTICADO.*/ 
app.get('/api/protected', ensureToken, function(req, res) {
    jwt.verify(req.token, 'my_secret_key', function(err, data) {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                text: 'this is protected',
                data: data
            })
        }
    })
    res.json({
        text: 'This is protected!'
    })
})

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

app.listen(3000)