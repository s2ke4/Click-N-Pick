const handleDelete = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    tr.style.opacity = 0;
    table.removeChild(tr);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/buyer/deleteFromWishlist', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
    if(table.children.length==1){
        document.getElementsByClassName("empty-cart")[0].style.display = "block";
        document.getElementsByClassName("user-cart")[0].style.display = "none";
    }
}

const handleMoveToCart = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    tr.style.opacity = 0;
    setTimeout(()=>{table.removeChild(tr);},500);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/buyer/moveToCartFromWishList', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
}