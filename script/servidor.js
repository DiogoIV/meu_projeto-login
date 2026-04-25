const express = require('express')
const app = express()
const cors = require('cors')

const { MongoClient } = require('mongodb')

const url = "mongodb://diogorodriguesdasilva156_db_user:Dingo157@ac-j8kt6t6-shard-00-00.1ulz8m0.mongodb.net:27017,ac-j8kt6t6-shard-00-01.1ulz8m0.mongodb.net:27017,ac-j8kt6t6-shard-00-02.1ulz8m0.mongodb.net:27017/?ssl=true&replicaSet=atlas-p6c5a3-shard-0&authSource=admin&appName=Cluster0"
const client = new MongoClient(url)

let db

app.use(express.json())
app.use(cors())

async function conectar() {
    try {
        await client.connect()
        db = client.db('meubanco')

        await db.collection('usuarios').createIndexes([
            { key: { usuario: 1 }, unique: true },
            { key: { email: 1 }, unique: true }
        ])
        console.log("Mongo conectado")
    } catch (err) {
        console.log(err)
    }
}

app.post('/usuarios', async (req, res) => {
    console.log(req.body)
    try {
        await db.collection('usuarios').insertOne({
            usuario: req.body.usuario.trim(),
            email: req.body.email.trim(),
            senha: req.body.senha.trim()
        })

        res.status(200).json({ mensagem: 'Usuário cadastrado' })

    } catch (err) {
        console.log(err.keyValue)
        if (err.code === 11000) {
            return res.status(400).json({ mensagem: "Usuário ou email já existe" })
        }
        console.log(`${err}, problema no envio`)
        return res.status(500).json({ mensagem: 'Erro no servidor' })
    }
})

app.listen(3000, async () => {
    await conectar()
    console.log('rodando')
})