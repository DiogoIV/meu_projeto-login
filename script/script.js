const inputs = document.querySelectorAll(".input-login input");

inputs.forEach(input => {
    input.addEventListener("invalid", (e)=>{
        e.preventDefault();
        input.style.border = "2px solid red";
    });
    input.addEventListener("input", ()=>{
    input.style.border = "";
});
});