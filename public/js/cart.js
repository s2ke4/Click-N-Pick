let inc = document.getElementsByClassName("increment");
let dec = document.getElementsByClassName("decrement");
let inp = document.getElementsByClassName("number");
let pricePerItem = document.getElementsByClassName("price-per-item");
let partial_total = document.getElementsByClassName("total-per-item");
let totalSum = document.getElementsByClassName("total-amount")[0];

const increment = (e,itemId,userId)=>{
    let parent = e.parentNode;
    let input = parent.getElementsByClassName("number")[0];
    let val = input.value;
    input.value =  parseInt(val) + 1;
    let tr = parent.parentNode.parentNode.parentNode;
    updateValue(tr,parseInt(input.value),userId,itemId,true);
}

const decrement = (e,itemId,userId)=>{
    let parent = e.parentNode;
    let input = parent.getElementsByClassName("number")[0];
    let val = input.value;
    if(parseInt(val) > 1){
        input.value =  parseInt(val) - 1;
        let tr = parent.parentNode.parentNode.parentNode;
        updateValue(tr,parseInt(input.value),userId,itemId,true);
    }
}

const handleBlur = (e,itemId,userId)=>{
    let parent = e.parentNode;
    let input = parent.getElementsByClassName("number")[0];
    let val = input.value;
    console.log("HELLO")
    if(val.trim()=="" || parseInt(val) <1){
        input.value = "1";
    }
    let tr = parent.parentNode.parentNode.parentNode;
    updateValue(tr,parseInt(input.value),userId,itemId,true);
}

const handleChange = (e,itemId,userId)=>{
    let parent = e.parentNode;
    let input = parent.getElementsByClassName("number")[0];
    let tr = parent.parentNode.parentNode.parentNode;
    updateValue(tr,parseInt(input.value),userId,itemId,false);
}

const handleInput = (e,itemId,userId)=>{
    let parent = e.parentNode;
    let input = parent.getElementsByClassName("number")[0];
    let val = input.value;
    let tr = parent.parentNode.parentNode.parentNode;
    if(val.trim()=="" || parseInt(val) <1){
        ;
    }else{
        updateValue(tr,parseInt(input.value),userId,itemId,false);
    }
}

const updateValue = async(tr,value,userId,itemId,request)=>{
    let val = parseInt(tr.getElementsByClassName("price-per-item")[0].innerText);
    let num = Math.max(1,value);
    tr.getElementsByClassName("total-per-item")[0].innerText = val*num;
    if(request){
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/buyer/updateCart', true);
        await xhr.setRequestHeader('Content-Type', 'application/json');
        await xhr.send(
            JSON.stringify({
                quantity:num,userId,itemId
            }) 
        );
    }
    updateTotalSum();
}

const updateTotalSum = ()=>{
    let sum=0;
    console.log(partial_total)
    for(let i=0;i<partial_total.length;i++)
    {
        sum+=parseInt(partial_total[i].innerText);
    }
    totalSum.innerText = sum;
}

const handleMoveToWishlist = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    tr.style.opacity = 0;
    setTimeout(()=>{table.removeChild(tr);},500);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/buyer/moveToWishListFromCart', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
    updateTotalSum();
}

const handleDelete = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    tr.style.opacity = 0;
    setTimeout(()=>{table.removeChild(tr);},500);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/buyer/deleteFromCart', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
    console.log(table)
    updateTotalSum();
}

updateTotalSum();