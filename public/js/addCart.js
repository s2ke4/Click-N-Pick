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

document.getElementsByClassName("arechaljabhai")[0].addEventListener("click",async(e)=>{
    console.log("HELLLLLLO")
    var formData = new FormData();
    formData.append("id1","id");
    formData.append("id2","id");
    var request = new XMLHttpRequest();
    request.open("POST","/buyer/arechaljabhai",true);
    request.send(formData);
})