const inputs = document.querySelectorAll("section.conteiner input");
const conteiner = document.querySelector('.conteiner')
const loginLink = document.querySelector('#btn_login')
const registerLink = document.querySelector('#btn_register')

registerLink.addEventListener('click', ()=> {
    conteiner.classList.add('active')
})
loginLink.addEventListener('click', ()=> {
    conteiner.classList.remove('active')
})




inputs.forEach(input => {
    input.addEventListener("invalid", (e)=>{
        e.preventDefault();
        input.style.border = "2px solid red";
    });
    input.addEventListener("input", ()=>{
    input.style.border = "";
});
});