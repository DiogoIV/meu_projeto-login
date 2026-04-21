const inputs = document.querySelectorAll("section.conteiner input");
const conteiner = document.querySelector('.conteiner')
const Linkregister = document.querySelector('#btn_register')
const Linklogin = document.querySelector('#btn_login')



Linkregister.addEventListener('click', ()=> {
    conteiner.classList.add('active')
})
Linklogin.addEventListener('click', ()=> {
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