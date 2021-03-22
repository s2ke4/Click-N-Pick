const addToCart = async(itemId,userId)=>{
    // e.preventDefault();
    console.log(itemId,userId);
    var formData = new FormData();
    var request = new XMLHttpRequest();
    formData.append("itemId",itemId);
    formData.append("userId",userId);
    request.open("POST","/buyer/addToCart",true);
    request.send(formData);
}
