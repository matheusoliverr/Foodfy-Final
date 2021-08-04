let radioInput = document.querySelector('.input-area.radio input[type="radio"]')

let radioValue = radioInput.checked

radioInput.addEventListener("click", ()=>{

    if(radioValue==true){
        radioValue=false
        radioInput.checked=false
    }
    else if(radioValue==false){
        radioValue=true
        radioInput.checked=true
    }
})


function addNewInput(event){
    const inputArea = event.target.parentNode
    const inputArray = inputArea.querySelector(".input-array")
    const latestInputs = inputArray.querySelectorAll(".latest-inputs")

    const newInput = latestInputs[latestInputs.length - 1].cloneNode(true)

    if(newInput.children[0].value == "") return false

    newInput.children[0].value = ""

    inputArray.appendChild(newInput)
}

// LOGIN

const loginInput = document.querySelectorAll('#login-form .input-area input')
const error = document.querySelector(".messages.error")

if(error){
    loginInput.forEach(login => {
        login.classList.add("error")
    })
        
}