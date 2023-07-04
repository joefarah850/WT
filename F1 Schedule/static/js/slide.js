let slideIndex = 1;
showSlides();

function currentSlide(n) {
    slideIndex = n;

    showSlide(n);
}

function showSlide(n) {
    for (let i = 1; i <= 3; i++) {
        let btn = document.getElementById("s-btn-" + i);
        btn.classList.remove("active");
    }
    let newbtn = document.getElementById("s-btn-" + n);
    newbtn.className += "active";

    let scrollPosition = window.scrollY;

    window.location.href = '#slide-' + n;

    window.scrollTo(-1, scrollPosition);
}

function plusSlide(n) {
    if (n > 0) {

        slideIndex++;

        if (slideIndex > 3)
            slideIndex = 1
    } else {
        slideIndex--;

        if (slideIndex < 1)
            slideIndex = 3
    }

    showSlide(slideIndex);
}

function showSlides() {
    plusSlide(1);
    setTimeout(showSlides, 4000);
}