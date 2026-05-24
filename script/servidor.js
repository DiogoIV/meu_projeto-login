import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import express from 'express'
import cors from 'cors'
import {MongoClient} from 'mongodb'
import nodemailer from 'nodemailer'

const app = express()
const url = process.env.MONGO_URL
const client = new MongoClient(url)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
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





/*Registro*/
app.post('/usuarios', async (req, res) => {
    console.log(req.body)

    const senhaHash = await bcrypt.hash(
        req.body.senha.trim(),
        10
    )
    try {
        await db.collection('usuarios').insertOne({
            usuario: req.body.usuario.trim(),
            email: req.body.email.trim(),
            senha: senhaHash
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

/*login*/

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
    console.log(usuario, senha)
    const user = await db.collection('usuarios').findOne({ usuario })
    
    console.log(user)
    if (!user) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    const senhaCorreta =
        await bcrypt.compare(
            senha,
            user.senha
    )

    if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'Senha incorreta' })

    }

    const token = jwt.sign(
        {
            id: user._id,
            usuario: user.usuario
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )

    res.status(200).json({ mensagem: 'Logado com Sucesso', token })

})

/*Recuperar a senha*/


app.post('/recuperar_senha', async (req, res) => {

    const { email } = req.body
    const email_banco = await db.collection('usuarios').findOne({ email })

    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let codigo = ''

    const valores = crypto.randomBytes(6)

    valores.forEach(valor => {
        codigo += caracteres[valor % caracteres.length]
    })

    if (email_banco) {
        await db.collection('usuarios').updateOne(
            { email: email_banco.email },
            { $set: { resetToken: codigo} }
        )

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de senha',
            text: `Seu código é: ${codigo}`
        }
        await transporter.sendMail(mailOptions)

        return res.status(200).json({ mensagem: 'Token enviado para seu email' })
    } else {
        return res.status(404).json({ mensagem: 'Email não encontrado' })
    }
})


/*validar token */

app.post('/token', async (req, res) => {
    const { token } = req.body
    const token_usuario = await db.collection('usuarios').findOne({ resetToken: token })

    if (token_usuario) {
        return res.status(200).json({ mensagem: 'Token valido' })
    } else {
        return res.status(404).json({ mensagem: 'Token invalido' })
    }

})

/* redefinir senha*/


app.post('/redefinir_senha', async (req, res) => {
    try {
        const { novasenha, confirmarsenha, token } = req.body

        const usuario = await db.collection('usuarios').findOne({ resetToken: token })

           
        console.log(usuario)
        console.log(token)

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Token Invalido' })
        }

        if (!novasenha || !confirmarsenha) {
            return res.status(400).json({ mensagem: "Campos obrigatórios" })
        }

        if (novasenha !== confirmarsenha) {
            return res.status(400).json({ mensagem: 'Senha Inválida' })
        }

        

        const senhaHash = await bcrypt.hash(
            novasenha.trim(),
            10
        ) 

        await db.collection('usuarios').updateOne({ resetToken: token },
            {
                $set: { senha: senhaHash },
                $unset: { resetToken: "" }
            }
        )

        res.status(200).json({ mensagem: 'Senha redefinida' })

    } catch (erro) {
        console.log(erro, 'Erro Interno')
    }

})




app.listen(process.env.PORT, async () => {
    await conectar()
    console.log('rodando')
})