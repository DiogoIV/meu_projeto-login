const el = { 
    conteiner : document.querySelector('.conteiner'),
    Linkregister : document.querySelector('#btn_register'),
    Linklogin : document.querySelector('#btn_login'),

    input_usuarioRegistro: document.querySelector('.input-register #usu'),
    input_emailRegistro: document.querySelector('.input-register #email'),
    input_senhaRegistro: document.querySelector('.input-register #senha')
}

const regexs = {
    regx_usuario: /^[a-zA-Z](?!.*[._]{2})[\w.]{2,14}[a-zA-Z]$/,
    regx_email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    regx_senha: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{6,}$/
}

function alterarTela() {
    el.Linkregister.addEventListener('click', ()=> {
        el.conteiner.classList.add('active')
    })

    el.Linklogin.addEventListener('click', ()=> {
        el.conteiner.classList.remove('active')
    })
}

function validarformulario(input, regex) {
    const valor = input.value

    if(regex.test(valor)) {
        input.style.border = "2px solid green"
    } else {
        input.style.border = "2px solid red"
    }
}

el.input_usuarioRegistro.addEventListener('input', ()=> 
    validarformulario(el.input_usuarioRegistro, regexs.regx_usuario)
)

el.input_emailRegistro.addEventListener('input', ()=> 
    validarformulario(el.input_emailRegistro, regexs.regx_email)
)

el.input_senhaRegistro.addEventListener('input', ()=> 
    validarformulario(el.input_senhaRegistro, regexs.regx_senha)
)

function avisodoformulario() {
    el.inputs.forEach(input => {
        input.addEventListener("invalid", (e)=>{
            e.preventDefault();
            input.style.border = "2px solid red";
        });
        input.addEventListener("input", ()=>{
        input.style.border = "";
        });
    });
}


alterarTela()
avisodoformulario()

