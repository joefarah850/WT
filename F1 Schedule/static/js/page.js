let pageIndex = 1;

function currentPage(n) {
    pageIndex = n;

    showPage(n);
}

function showPage(n) {
    for (let i = 1; i <= 3; i++) {
        let btn = document.getElementById("p-btn-" + i);
        btn.classList.remove("active");
    }
    let newbtn = document.getElementById("p-btn-" + n);
    newbtn.className += "active";

    let scrollPosition = window.scrollY;

    window.location.href = '#page-' + n;

    window.scrollTo(-1, scrollPosition);
}

function plusPage(n) {
    if (n > 0) {

        pageIndex++;

        if (pageIndex > 3)
            pageIndex = 1
    } else {
        pageIndex--;

        if (pageIndex < 1)
            pageIndex = 3
    }

    showPage(pageIndex);
}

showPage(1);