/*global*/
const el = {
    conteiner: document.querySelector('.conteiner'),
    Linkregister: document.querySelector('#btn_register'),
    Linklogin: document.querySelector('#btn_login'),
    aviso: document.querySelectorAll('.aviso'),
    olho_aberto: document.querySelectorAll('.openeyes')
}

const regexs = {
    regx_usuario: /^[a-zA-Z](?!.*[._]{2})[\w.]{2,14}[a-zA-z\d]$/,
    regx_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    regx_senha: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{6,}$/
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
    inputs: document.querySelectorAll('.form_register input'),
    input_usuarioRegistro: document.querySelector('.input-register #usu'),
    input_emailRegistro: document.querySelector('.input-register #email'),
    input_senhaRegistro: document.querySelector('.input-register #resenha'),
    input_senhaRegistroconfirmar: document.querySelector('.input-register #senhaconfirm'),
    button_register: document.querySelector('.register')
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


function validarConfirmaSenha() {
    const senha = register.input_senhaRegistro.value
    const confirmar = register.input_senhaRegistroconfirmar.value;
    
    if (confirmar !== senha || confirmar.includes(' ')|| confirmar.trim() == '') {
        register.input_senhaRegistroconfirmar.style.border = '2px solid red';
        return false;
    } else {
        register.input_senhaRegistroconfirmar.style.border = '2px solid green';
        return true;
    }
}

register.input_senhaRegistroconfirmar.addEventListener('input', () => {
    validarConfirmaSenha();
});

register.button_register.addEventListener('click', async (ele) => {
    ele.preventDefault()

    const usuariok = validarformulario(register.input_usuarioRegistro, regexs.regx_usuario)
    const emailok = validarformulario(register.input_emailRegistro, regexs.regx_email)
    const senhaok = validarformulario(register.input_senhaRegistro, regexs.regx_senha)
    const senhaconfirm = validarConfirmaSenha()
    

    if (!usuariok || !emailok || !senhaok|| !senhaconfirm) {
        el.aviso[1].classList.add('aviso_active')
        return el.aviso[1].textContent = 'Preencha os dados corretamente'
    }

    

    try {
        const res = await fetch('http://localhost:3000/usuarios', {
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
            return alert(dados.mensagem)

        }
        el.conteiner.classList.remove('active')
        alert(dados.mensagem)

    } catch (err) {
        console.log(err)
    }
})

/*-----Logar----*/
const login = {
    aviso_login: document.getElementsByClassName('aviso_login')[0],
    forgot_password:document.getElementById('forget_password'),
    validar_codigo: document.getElementById('token_enviar'),

    inputs_login: document.querySelectorAll('.form_login input'),
    inputs_usuarioLogin: document.querySelector('.form_login #texto'),
    inputs_usenhaLogin: document.querySelector('.form_login #senha'),
    inputs_esqueciSenha: document.querySelector('#email_recuperar'),
    button_login: document.querySelector('#button_login'),
    button_esqueci: document.querySelector('#esqueci_senha')
}



function alterarinput() {
    el.olho_aberto.forEach(icone=>{
        icone.addEventListener('click', ()=> {
            const id = icone.dataset.target;
            const input = document.getElementById(id)
            if(input.type === 'text') {
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



    const res = await fetch('http://localhost:3000/login', {
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
    alert(dados.mensagem)
})

/*esqueci a senha*/

login.forgot_password.addEventListener('click', (ele)=> {
    ele.preventDefault()
    el.conteiner.classList.add('active_token')
})


login.inputs_esqueciSenha.addEventListener('input', el =>{
    
    validarformulario(el.target, regexs.regx_email)
})

login.button_esqueci.addEventListener('click', async e =>{
    e.preventDefault()
    const email_recuperar = login.inputs_esqueciSenha.value
    const aviso_login = el.aviso[2]
    
    if (!regexs.regx_email.test(email_recuperar)) {
        aviso_login.classList.add('aviso_active')
        return aviso_login.textContent = 'Email envalido'
    } else {
        aviso_login.classList.remove('aviso_active')
    }

    const res = await fetch('http://localhost:3000/recuperar_senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email_recuperar
        })
    })
    const dados = await res.json()
    alert(dados.mensagem)
    if(res.ok) {
        el.conteiner.classList.remove('active_token')
        el.conteiner.classList.add('active_validar_token')
        
    }
})



login.validar_codigo.addEventListener('click', el=> {
    el.preventDefault()
})


alterarinput()
alterarTela()
verificarCampos()















