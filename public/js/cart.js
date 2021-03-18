let inc = document.getElementsByClassName("increment");
let dec = document.getElementsByClassName("decrement");
let inp = document.getElementsByClassName("number");
let pricePerItem = document.getElementsByClassName("price-per-item");
let partial_total = document.getElementsByClassName("total-per-item");
let totalSum = document.getElementsByClassName("total-amount")[0];
for(let i=0;i<inc.length;i++)
{
    inc[i].addEventListener("click",()=>{
        let val = inp[i].value;
        inp[i].value =  parseInt(val) + 1;
        updateValue(i);
    })
    dec[i].addEventListener("click",()=>{
        let val = parseInt(inp[i].value);
        if(val > 1){
            inp[i].value =  val - 1;
            updateValue(i);
        }
    })
    inp[i].addEventListener("blur",()=>{
        if(inp[i].value.trim()=="" || parseInt(inp[i].value) <1){
            inp[i].value = "1";
        }
        updateValue(i);
    })
    inp[i].addEventListener("change",()=>{
        updateValue(i);
    })
    inp[i].addEventListener("input",()=>{
        if(inp[i].value.trim()=="" || parseInt(inp[i].value) <1){
            ;
        }else{
            updateValue(i);
        }
    })
}

const updateValue = (i)=>{
    let val = parseInt(pricePerItem[i].innerText);
    let num = Math.max(1,parseInt(inp[i].value));
    partial_total[i].innerText = val*num;
    updateTotalSum();
}

const updateTotalSum = ()=>{
    let sum=0;
    for(let i=0;i<partial_total.length;i++)
    {
        sum+=parseInt(partial_total[i].innerText);
    }
    totalSum.innerText = sum;
}