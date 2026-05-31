import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
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

function autenticar(req, res, next) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            mensagem: 'Sem token'
        })
    }

    const token = authHeader.split(' ')[1]

    try {

        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = user

        next()

    } catch {

        return res.status(401).json({
            mensagem: 'Token inválido'
        })

    }

}




/*Registro*/
app.post('/registrar', async (req, res) => {
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
    try {
        const { usuario, senha } = req.body;

        const user = await db.collection('usuarios').findOne({ usuario });

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: 'Senha incorreta' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                usuario: user.usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ mensagem: 'Logado com sucesso', token });

    } catch (erro) {

        console.error('ERRO LOGIN:', erro);

        res.status(500).json({
            mensagem: 'Erro interno do servidor',
            erro: erro.message,
            stack: erro.stack
        });
    }

});

/*Recuperar a senha*/


app.post('/recuperar_senha', async (req, res) => {
    try {
        console.log("chegou na rota")

        const { email } = req.body

        if (!email) {
            return res.status(400).json({ mensagem: "Email obrigatório" })
        }

        const email_banco = await db.collection('usuarios').findOne({ email })

        console.log("usuario encontrado:", email_banco)

        if (!email_banco) {
            return res.status(404).json({ mensagem: "Email não encontrado mds" })
        }

        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let codigo = ''

        const valores = crypto.randomBytes(6)

        valores.forEach(valor => {
            codigo += caracteres[valor % caracteres.length]
        })

        await db.collection('usuarios').updateOne(
            { email },
            {
                $set: {
                    resetToken: codigo,
                    resetTokenExpira: Date.now() + 1000 * 60 * 10
                }
            }
        )

        const resend = new Resend(process.env.RESEND_API_KEY)
        console.log(email)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Recuperação de senha',
            text: `Seu código é: ${codigo}`
        })

        console.log("TOKEN GERADO:", codigo)

        return res.status(200).json({
            mensagem: "Token gerado com sucesso",
            token: codigo
        })

    } catch (err) {
        console.error("ERRO RECUPERAR SENHA:", err)

        return res.status(500).json({
            mensagem: "Erro interno",
            erro: err.message
        })
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

        if (Date.now() > usuario.resetTokenExpira) {
            return res.status(400).json({ mensagem: 'Token expirado' })
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


app.get('/perfil', autenticar, (req, res) => {
    res.status(200).json(req.user)

})

const PORTA = process.env.PORT || 3000

app.listen(PORTA, async () => {
    try {
        await conectar()

        if (!db) throw new Error("DB não inicializado")

        console.log('Mongo conectado')
        console.log('rodando')

    } catch (err) {
        console.error('Erro Mongo:', err)
        process.exit(1)
    }
})