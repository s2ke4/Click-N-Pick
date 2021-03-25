const handleDelete = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    tr.style.opacity = 0;
    setTimeout(()=>{table.removeChild(tr);},500);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/buyer/deleteFromWishlist', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
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