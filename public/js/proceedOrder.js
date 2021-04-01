const ele = document.getElementsByClassName("onSelect");
const detail = document.getElementsByClassName("detail");
const nextBtn = document.getElementsByClassName("next")[0];
const notSelected = document.getElementsByClassName("not-selected")[0];
const upiNotSelected = document.getElementsByClassName("upiIdNotProvided")[0];
const cardDetailNotProvided = document.getElementsByClassName("cardDetailNotProvided")[0];
const upiId = document.getElementById("upiId")
const cardName = document.getElementById("cardName")
const cardNumber = document.getElementById("cardNumber")
const cardMonth = document.getElementById("cardMonth")
const cardYear = document.getElementById("cardYear")
const value = document.getElementsByClassName("value")
const paymentMethod = document.getElementsByClassName("paymentMethod")[0];
const address = document.getElementsByClassName("address")[0]
const afterCur = document.getElementsByClassName("after-current")[0];
const back = document.getElementsByClassName("back")[0];
const orderNow = document.getElementsByClassName("order-now")[0];
for(let i=0;i<ele.length;i++)
{
    ele[i].addEventListener("click",()=>{
        notSelected.style.display = "none";
        upiNotSelected.style.display = "none";
        cardDetailNotProvided.style.display = "none";
        for(let i=0;i<value.length;i++){
            value[i].style.borderColor="grey";
        }
        for(let j=0;j<ele.length;j++){
            if(detail[j]){
                detail[j].style.display = "none";
            }
        }
        if(detail[i]){
            detail[i].style.display = "block";
        }
    })
}

for(let i=0;i<value.length;i++)
{
    value[i].addEventListener("input",()=>{
        upiNotSelected.style.display = "none";
        cardDetailNotProvided.style.display = "none";
        if(value[i].value.trim()!=""){
            value[i].style.borderColor = "grey"
        }
    })
}

nextBtn.addEventListener("click",()=>{
    let isSelect = false,val;
    for(let i=0;i<ele.length;i++)
    {
        if(ele[i].checked){
            isSelect = true;
            val = ele[i].value;
            break;
        }
    }
    if(!isSelect){
        notSelected.style.display = "block";
        return;
    }
    if(val=="upi" && upiId.value.trim()==""){
        upiId.style.borderColor="rgb(195, 55, 55)";
        upiNotSelected.style.display="block"
        return;
    }
    if(val=="card" && (cardName.value.trim()==""|| cardNumber.value.trim()==""||cardMonth.value.trim()==""|| cardYear.value.trim()=="")){
        if(cardName.value.trim()==""){
            cardName.style.borderColor = "rgb(195, 55, 55)";
        }
        if(cardNumber.value.trim()==""){
            cardNumber.style.borderColor = "rgb(195, 55, 55)";
        }
        if(cardMonth.value.trim()==""){
            cardMonth.style.borderColor = "rgb(195, 55, 55)";
        }
        if(cardYear.value.trim()==""){
            cardYear.style.borderColor = "rgb(195, 55, 55)";
        }
        cardDetailNotProvided.style.display="block";
        return;
    }
    paymentMethod.style.display = "none";
    address.style.display = "block";
    document.getElementById("shipping-address-textarea").style.height = (document.getElementById("shipping-address-textarea").scrollHeight + 4) + 'px';
    afterCur.classList.add("current");
})


document.getElementById("shipping-address-textarea").addEventListener("input",function(){
    this.style.height = 'auto';
    this.style.height = ((this.scrollHeight)+4) + 'px';
})

back.addEventListener("click",()=>{
    paymentMethod.style.display = "block";
    address.style.display = "none";
    afterCur.classList.remove("current");
})

orderNow.addEventListener("click",()=>{
    
})