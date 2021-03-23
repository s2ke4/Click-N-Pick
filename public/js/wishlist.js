const handleDelete = async(e,itemId,userId)=>{
    let tr = e.parentNode.parentNode;
    let table = tr.parentNode;
    table.removeChild(tr);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/buyer/deleteFromWishlist', true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
        JSON.stringify({
            userId,itemId
        }) 
    );
}