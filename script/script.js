const el = {
    conteiner: document.querySelector('.conteiner'),
    Linkregister: document.querySelector('#btn_register'),
    Linklogin: document.querySelector('#btn_login'),

    inputs: document.querySelectorAll('form_registro'),
    input_usuarioRegistro: document.querySelector('.input-register #usu'),
    input_emailRegistro: document.querySelector('.input-register #email'),
    input_senhaRegistro: document.querySelector('.input-register #senha'),
    button_register: document.querySelector('.register'),

    aviso: document.querySelector('span.aviso')
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
    })
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

el.input_usuarioRegistro.addEventListener('input', () =>
    validarformulario(el.input_usuarioRegistro, regexs.regx_usuario)
)

el.input_emailRegistro.addEventListener('input', () =>
    validarformulario(el.input_emailRegistro, regexs.regx_email)
)

el.input_senhaRegistro.addEventListener('input', () =>
    validarformulario(el.input_senhaRegistro, regexs.regx_senha)
)

function avisodoformulario() {
    el.inputs.forEach(input => {
        input.addEventListener("invalid", (e) => {
            e.preventDefault();
            input.style.border = "2px solid red";
        });
        input.addEventListener("input", () => {
            input.style.border = "";
        });
    });
}


el.button_register.addEventListener('click', async (ele) => {
    ele.preventDefault()

    const usuariok = validarformulario(el.input_usuarioRegistro, regexs.regx_usuario)
    const emailok = validarformulario(el.input_emailRegistro, regexs.regx_email)
    const senhaok = validarformulario(el.input_senhaRegistro, regexs.regx_senha)

    if(!usuariok||!emailok|| !senhaok) {
        return el.aviso.textContent = 'Preencha os dados Corretamente'
    } 
    try {    
        const res = await fetch('http://localhost:3000/usuarios', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: el.input_usuarioRegistro.value,
                email: el.input_emailRegistro.value,
                senha: el.input_senhaRegistro.value
                 
            })
        })
        const dados = await res.json()
        alert(dados.mensagem)
    } catch(err) {
        console.log(`${err}, Deu erro no fetch`)
    }
})


alterarTela()
avisodoformulario()

