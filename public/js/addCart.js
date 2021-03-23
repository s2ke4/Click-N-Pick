const addToCart = async(e,itemId,userId)=>{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/buyer/addToCart", true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    var resp = await xhr.send(
        JSON.stringify({
            itemId,userId
        }) 
    );
    cartClick(e);
    setTimeout(()=>cartRemove(e),3000);
}

function cartClick(e){
    // let button =this;
    e.classList.add('clicked');
}
    
function cartRemove(e){
    // let button =this;
    e.classList.remove('clicked');
}
