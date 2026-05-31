/*global*/
const el = {
    conteiner: document.querySelector('.conteiner'),
    conteiner_perfil: document.querySelector('#conteiner_perfil'),
    forms: document.querySelectorAll('form'),
    Linkregister: document.querySelector('#btn_register'),
    Linklogin: document.querySelector('#btn_login'),
    aviso: document.querySelectorAll('.aviso'),
    olho_aberto: document.querySelectorAll('.openeyes')
}

const regexs = {
    regx_usuario: /^[a-zA-Z](?!.*[._]{2})[\w.]{2,14}[a-zA-z\d]$/,
    regx_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    regx_senha: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/
}

function Mostraraviso(aviso, aviso_texto, estado) {
    aviso.style.color = ''

    if (estado === 'aviso_negativo') {
        aviso.classList.add('aviso_active')
        aviso.textContent = aviso_texto
    } else if (estado === 'aviso_desativar') {
        aviso.classList.remove('aviso_active')
    } else if (estado === 'aviso_positivo') {
        aviso.classList.add('aviso_active')
        aviso.style.color = 'green'
        aviso.textContent = aviso_texto
    }


}

function LimparInputs(forms) {
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input')
        inputs.forEach(input => {
            input.value = ''
        })
    })
}

function alterarTela() {
    el.Linkregister.addEventListener('click', () => {
        el.conteiner.classList.add('active')

    })

    el.Linklogin.addEventListener('click', () => {
        el.conteiner.classList.remove('active')
        register.inputs.forEach(inputs => {
            inputs.value = ''
            inputs.style.border = ''
        })
        el.aviso.forEach(el => {
            return el.classList.remove('aviso_active')
        })
    })
}

/*-----Registro-----*/



const register = {
    container_form_register: document.querySelector('.form_register'),
    inputs: document.querySelectorAll('.form_register input'),
    input_usuarioRegistro: document.querySelector('.input-register #usu'),
    input_emailRegistro: document.querySelector('.input-register #email'),
    input_senhaRegistro: document.querySelector('.input-register #resenha'),
    input_senhaRegistroconfirmar: document.querySelector('.input-register #senhaconfirm'),
    button_register: document.querySelector('.register'),
    input_checkbox_register: document.querySelector('#icheckbox_register')
}

function validarformulario(input, regex) {
    const valor = input.value
    if (valor !== valor.trim()) {
        input.style.border = "2px solid red"
        return false
    }

    if (regex.test(valor)) {
        input.style.border = "2px solid green"
        return true
    } else {
        input.style.border = "2px solid red"
        return false
    }
}



function verificarCampos() {
    register.input_usuarioRegistro.addEventListener('input', () =>
        validarformulario(register.input_usuarioRegistro, regexs.regx_usuario)
    )

    register.input_emailRegistro.addEventListener('input', (et) => {

        validarformulario(register.input_emailRegistro, regexs.regx_email)
        console.log(register.input_emailRegistro.value)
    })

    register.input_senhaRegistro.addEventListener('input', () =>
        validarformulario(register.input_senhaRegistro, regexs.regx_senha)
    )

}


function validarConfirmaSenha(senha, confirmar) {
    const novasenha = senha.value
    const confirmarsenha = confirmar.value
    if (confirmarsenha !== novasenha || confirmarsenha.includes(' ') || confirmarsenha.trim() == '') {
        confirmar.style.border = '2px solid red';
        return false;
    } else {
        confirmar.style.border = '2px solid green';
        return true;
    }
}

register.input_senhaRegistroconfirmar.addEventListener('input', () => {
    const senha = register.input_senhaRegistro
    const confirmar = register.input_senhaRegistroconfirmar
    validarConfirmaSenha(senha, confirmar);
});

register.button_register.addEventListener('click', async (ele) => {
    ele.preventDefault()

    const usuariok = validarformulario(register.input_usuarioRegistro, regexs.regx_usuario)
    const emailok = validarformulario(register.input_emailRegistro, regexs.regx_email)
    const senhaok = validarformulario(register.input_senhaRegistro, regexs.regx_senha)
    const senhaconfirm = validarConfirmaSenha(register.input_senhaRegistro, register.input_senhaRegistroconfirmar)

    console.log(senhaconfirm)
    if (!usuariok || !emailok || !senhaok || !senhaconfirm) {
        return Mostraraviso(el.aviso[1], 'preencha os dados', 'aviso_negativo')
    }


    if (!register.input_checkbox_register.checked) {
        return Mostraraviso(el.aviso[1], 'Marque os termos', 'aviso_negativo')
    }



    try {
        const res = await fetch('https://meu-projeto-login-1.onrender.com/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: register.input_usuarioRegistro.value,
                email: register.input_emailRegistro.value,
                senha: register.input_senhaRegistro.value

            })

        })
        const dados = await res.json()

        register.inputs.forEach(input => {
            input.value = ''
            input.style.border = ''
        })

        console.log(res.ok)
        if (!res.ok) {
            return Mostraraviso(el.aviso[1], dados.mensagem, 'aviso_negativo')

        }
        setTimeout(() => {
            Mostraraviso(el.aviso[1], dados.mensagem, 'aviso_positivo')
        }, 1000)
        setTimeout(() => {
            el.conteiner.classList.remove('active')
        }, 2000)




    } catch (err) {
        console.log(err)
    }
})

/*-----Logar----*/
const login = {
    aviso_login: document.getElementsByClassName('aviso_login')[0],
    forgot_password: document.getElementById('forget_password'),
    validar_codigo: document.getElementById('token_enviar'),
    input_token: document.getElementById('input_token'),


    conteiner_login: document.querySelector('.form_login'),
    inputs_login: document.querySelectorAll('.form_login input'),
    inputs_usuarioLogin: document.querySelector('.form_login #texto'),
    inputs_usenhaLogin: document.querySelector('.form_login #senha'),
    inputs_esqueciSenha: document.querySelector('#email_recuperar'),
    button_login: document.querySelector('#button_login'),
    button_esqueci: document.querySelector('#esqueci_senha')
}



function alterarinput() {
    el.olho_aberto.forEach(icone => {
        icone.addEventListener('click', () => {
            const id = icone.dataset.target;
            const input = document.getElementById(id)
            if (input.type === 'text') {
                input.type = 'password'
                icone.classList.remove('fa-eye')
                icone.classList.add('fa-eye-slash')

            } else {
                input.type = 'text'
                icone.classList.remove('fa-eye-slash')
                icone.classList.add('fa-eye')
            }
        })
    })

    login.inputs_login.forEach(el => {
        el.addEventListener('input', () => {
            el.value = el.value.replace(/\s/g, '')
        })

    })
}



login.button_login.addEventListener('click', async e => {
    try {

        e.preventDefault()
        const usuario = login.inputs_usuarioLogin.value;
        const senha = login.inputs_usenhaLogin.value;
        const aviso_login = el.aviso[0]

        if (!regexs.regx_usuario.test(usuario)) {
            aviso_login.classList.add('aviso_active')
            return aviso_login.textContent = 'Usuario Invalido'
        }
        if (!regexs.regx_senha.test(senha)) {
            aviso_login.classList.add('aviso_active')
            return aviso_login.textContent = 'Senha Invalida'

        }



        const res = await fetch('https://meu-projeto-login-1.onrender.com/login', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario, senha: senha
            }
            )
        })

        const dados = await res.json()
        console.log(dados)
        if (res.ok) {
            localStorage.setItem(
                'token',
                dados.token
            )
            el.conteiner.classList.add('active')
            alert(dados.mensagem)
            register.container_form_register.style.display = 'none'
            el.conteiner_perfil.style.display = 'flex'
            el.conteiner_perfil.style.position = 'absolute'

        } else {
            alert(dados.mensagem)
            localStorage.removeItem('token')
        }

    } catch (erro) {
        console.log(erro, 'Erro ao logar')
    }

})


window.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token')



    const res = await fetch('https://meu-projeto-login-1.onrender.com/perfil', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const dados = await res.json()

    if (res.ok) {
        el.conteiner.classList.add('active')
        register.container_form_register.style.display = 'none'
        el.conteiner_perfil.style.display = 'flex'
        el.conteiner_perfil.style.position = 'absolute'

    }

})


/*esqueci a senha*/


login.forgot_password.addEventListener('click', (ele) => {
    ele.preventDefault()
    el.conteiner.classList.add('active_token')
})


login.inputs_esqueciSenha.addEventListener('input', el => {

    validarformulario(el.target, regexs.regx_email)
})

login.button_esqueci.addEventListener('click', async e => {
    try {
        console.log('cliclou no botao esqueci')
        e.preventDefault()
        const email_recuperar = login.inputs_esqueciSenha.value
        const aviso_login = el.aviso[2]

        if (!regexs.regx_email.test(email_recuperar)) {
            aviso_login.classList.add('aviso_active')
            return aviso_login.textContent = 'Email envalido'
        } else {
            aviso_login.classList.remove('aviso_active')
        }

        const res = await fetch('https://meu-projeto-login-1.onrender.com/recuperar_senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email_recuperar
            })
        })

        const dados = await res.json()
        if (res.ok) {
            el.conteiner.classList.remove('active_token')
            el.conteiner.classList.add('active_validar_token')

        } else {
            alert(dados.mensagem)
        }
    } catch (err) {
        console.log(`erro em esquecia senha${err}`)
    }

})


/* validar token*/

function pegartoken() {
    const input_token = login.input_token.value
    return input_token
}

login.validar_codigo.addEventListener('click', async ele => {
    ele.preventDefault()
    const input_token_validar = pegartoken()
    const aviso_token = el.aviso[3]
    try {
        const res = await fetch('https://meu-projeto-login-1.onrender.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: input_token_validar })
        })
        console.log(input_token_validar)


        const dados = await res.json()
        if (res.ok) {
            alert(dados.mensagem)
            el.conteiner.classList.remove('active_validar_token')
            el.conteiner.classList.add('active_redefinir_senha')
        } else {
            aviso_token.classList.add('aviso_active')
            return aviso_token.textContent = dados.mensagem
        }

    } catch (erro) {
        console.log(erro)
    }


})

/* redefinir senha*/

const redefinir = {
    input_novasenha: document.querySelector('#nova_senha'),
    input_confirmarsenha: document.querySelector('#confirmar_senha_redefinir'),
    button_redefinir: document.querySelector('#butredefinir_senha'),


}

function redefinirSenha() {
    redefinir.input_novasenha.addEventListener('input', (ele) => {

        validarformulario(ele.target, regexs.regx_senha)
    })

    redefinir.input_confirmarsenha.addEventListener('input', ele => {
        validarConfirmaSenha(redefinir.input_novasenha, ele.target)
    })
}

redefinir.button_redefinir.addEventListener('click', async ele => {
    try {

        ele.preventDefault()

        const input_novasenha = redefinir.input_novasenha
        const input_confirmarsenha = redefinir.input_confirmarsenha
        const input_token_redefinir = pegartoken()
        const aviso4 = el.aviso[4]

        const inputsenhaok = validarformulario(input_novasenha, regexs.regx_senha)
        const inputconfirmarsenhaok = validarConfirmaSenha(redefinir.input_novasenha, redefinir.input_confirmarsenha)


        if (!inputsenhaok || !inputconfirmarsenhaok) {
            aviso4.classList.add('aviso_active')
            return aviso4.textContent = 'Preencha os dados Coretamente'

        } else {
            aviso4.classList.remove('aviso_active')
        }


        const res = await fetch('https://meu-projeto-login-1.onrender.com/redefinir_senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                novasenha: input_novasenha.value,
                confirmarsenha: input_confirmarsenha.value,
                token: input_token_redefinir
            })
        })
        const dados = await res.json()
        if (res.ok) {
            aviso4.classList.add('aviso_active')
            aviso4.style.color = 'green'
            aviso4.textContent = dados.mensagem || 'Senha redefinida com sucesso'
            setTimeout(() => {
                el.conteiner.classList.remove('active_redefinir_senha')
            }, 1000)

        } else {
            aviso4.classList.add('aviso_active')
            aviso4.textContent = dados.mensagem || 'Erro ao redefinir senha'
        }

    } catch (erro) {
        console.log(erro, 'erro ao enviar nova senha')
    }
})


/*Perfil login*/

const perfil_login = {
    usuario_bem_vindo: document.querySelector('.bem_vindo'),
    nome_usuario: document.querySelector('.nome_usario'),
    email_usuario: document.getElementsByClassName('email_usario')[0],

    button_editar: document.querySelector('.but_editar'),
    button_sair: document.querySelector('.but_sair')

}



perfil_login.button_sair.addEventListener('click', ele => {
    el.conteiner_perfil.style.display = 'none'
    LimparInputs(el.forms)
    el.conteiner.classList.remove('active')
    register.container_form_register.style.display = 'block'
    console.log(el.conteiner)
})









pegartoken()
alterarinput()
alterarTela()
verificarCampos()
redefinirSenha()
















