const express = require('express')
const app = express()
const cors = require('cors')

const { MongoClient } = require('mongodb')

const url = 'mongodb+srv://dingo:Dingo.157@servidor.7xqpblr.mongodb.net/?appName=Servidor'
const client = new MongoClient(url)

let db

app.use(express.json())
app.use(cors())

async function conectar() {
    try {
        await client.connect()
        db = client.db('meubanco')

        await db.collection('usuarios').createIndexes([
            { key: { nome: 1 }, unique: true },
            { key: { email: 1 }, unique: true }
        ])

        console.log("Mongo conectado")
    } catch (err) {
        console.log(err)
    }
}

app.post('/usuarios', async (req, res) => {
    try {
        await db.collection('usuarios').insertOne({
            nome: req.body.nome.trim(),
            email: req.body.email.trim(),
            senha: req.body.senha.trim()
        })

        res.status(200).json({ mensagem: 'Usuário cadastrado' })
    } catch (err) {
        console.log(`${err}, problema no envio`)
        res.status(500).json({ mensagem: 'Erro ao enviar dados' })
    }
})

app.listen(3000, async () => {
    await conectar()
    console.log('rodando')
})