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