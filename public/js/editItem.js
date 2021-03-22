var currentSlide = 0;
let slides = document.querySelectorAll(".slide")
let dots = document.querySelectorAll('.dot')
let uploadedFiles = [];
let removedFiles = [];
const slide_container = document.getElementsByClassName("slide-container")[0];
const dots_container = document.getElementsByClassName("dots-container")[0];
let productNameInp = document.getElementById("productName");
let brandNameInp= document.getElementById("brandName");
let priceInp = document.getElementById("price");
let discountInp = document.getElementById("discount");
let numOfItemInp = document.getElementById("numberOfItems");
let prodColorInp = document.getElementById("productColour");
let categoryInp = document.getElementById("category");
let desInp = document.getElementById("description");
let form = document.getElementById("form");
let cross = document.getElementsByClassName("Cross");
let editItemBtn = document.getElementsByClassName("add-item-btn")[0];
let deleteItemBtn = document.getElementsByClassName("remove-item-btn")[0];

document.getElementById("description").addEventListener("input",function(){
    this.style.height = 'auto';
    this.style.height = ((this.scrollHeight)+4) + 'px';
})

document.getElementById("description").style.height = (document.getElementById("description").scrollHeight + 4) + 'px';

editItemBtn.addEventListener("click",(e)=>{
    e.preventDefault();
})

deleteItemBtn.addEventListener("click",(e)=>{
    e.preventDefault();
})

const updateItem = (id)=>{
    var formData = new FormData();
    var request = new XMLHttpRequest();
    let productName = productNameInp.value.trim().replaceAll('"',"'");
    let brandName = brandNameInp.value.trim().replaceAll('"',"'");
    let price = priceInp.value;
    let discount = discountInp.value;
    let numOfItem = numOfItemInp.value;
    let prodColor = prodColorInp.value.trim().replaceAll('"',"'");
    let category = categoryInp.value;
    let des = desInp.value.trim().replaceAll('"',"'");
    dots = document.querySelectorAll('.dot');
    if(dots.length == 0){
        document.getElementsByClassName("err-msg")[0].style.display = "block";
        return;
    }
    if(productName!="" && brandName!="" && price!="" && discount!="" && numOfItem!="" && prodColor!="" && category!="" && des !=""){
        // for(let i=0;i<uploadedFiles.length;i++)
        // {
        //     formData.append("photos",uploadedFiles[i],uploadedFiles[i].name);
        // }
        for(let i=0;i<removedFiles.length;i++)
        {
            formData.append("remove",removedFiles[i]);
        }
        formData.append("productName",productName);
        formData.append("brandName",brandName);
        formData.append("price",price);
        formData.append("discount",discount);
        formData.append("numberOfItems",numOfItem);
        formData.append("productColour",prodColor);
        formData.append("category",category);
        formData.append("description",des);
        request.open("PUT",`/seller/editItem/${id}`,true);
        request.send(formData);
        window.location.href = "/";
    }
}

// code for uploading image
document.getElementById("files").addEventListener('change',function(){
    if(this.files && this.files[0]){
        document.getElementsByClassName("err-msg")[0].style.display = "none";
        let l = this.files.length;
        for (var i = 0; i < l; i++) {
            var file = this.files[i];
            uploadedFiles.push(file);
            var picReader = new FileReader();
            picReader.addEventListener("load", function (e){
                let div1 = document.createElement("div");
                div1.className = "slide fade";
                let img = document.createElement("IMG");
                img.setAttribute("src",e.target.result);
                div1.appendChild(img);
                slide_container.appendChild(div1);
                let span1 = document.createElement("span");
                span1.className = "dot";
                dots_container.appendChild(span1);
                slides = document.querySelectorAll(".slide")
                dots = document.querySelectorAll('.dot')
                updateListener();
                showSlide(0);
            });
            //Read the image
            picReader.readAsDataURL(file);
        }
        slide_container.style.display="flex";
    }
})

const showSlide = (n) => {
    if(slides.length > 0){
        slides.forEach((slide) => {
            slide.style.display = "none"
            dots.forEach((dot) => {
                dot.classList.remove("active")
            })
        })
        slides[n].style.display = "block"
        dots[n].classList.add("active")
    }
}

const next = () => {
    currentSlide >= slides.length - 1 ? currentSlide = 0 : currentSlide++
    showSlide(currentSlide)
}

const prev = () => {
    currentSlide <= 0 ? currentSlide = slides.length - 1 : currentSlide--
    showSlide(currentSlide)
}
 
const updateListener = ()=>{
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index)
            currentSlide = index
        })
    })
}
showSlide(0);
updateListener();

function removeImg(file,gold){
    let removeItem = gold.parentNode;
    let div = removeItem.parentNode;
    removedFiles.push(file);
    div.removeChild(removeItem);
    dots[0].remove();
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll('.dot')
    updateListener();
    showSlide(0);
}

// to delete an item
const deleteItem = (id)=>{
    var xhr = new XMLHttpRequest()
    xhr.open('post', `/seller/deleteItem/${id}`, true)
    xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
    xhr.send()
    window.location.href = "/";
}