let slides = document.querySelectorAll(".slide")
let dots = document.querySelectorAll('.dot')

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

// for adding in cart
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


const addToWishlist = async(cur,itemId,userId)=>{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/buyer/addToWishlist", true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    var resp = await xhr.send(
        JSON.stringify({
            itemId,userId
        }) 
    );
    let parent = cur.parentNode;
    cur.style.display = "none";
    parent.getElementsByClassName("removefromWishlist")[0].style.display = "block";
}

const removeFromWishlist = async(cur,itemId,userId)=>{
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', "/buyer/deleteFromWishlist", true);
    await xhr.setRequestHeader('Content-Type', 'application/json');
    var resp = await xhr.send(
        JSON.stringify({
            itemId,userId
        }) 
    );
    let parent = cur.parentNode;
    cur.style.display = "none";
    parent.getElementsByClassName("toWishlist")[0].style.display = "block";
}