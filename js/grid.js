const gridContainer1 = document.getElementById("gridContainer1");
const gridContainer2 = document.getElementById("gridContainer2");
const gridContainer3 = document.getElementById("gridContainer3");

let i = 0;

events.forEach((event) => {
    const gridItem = document.createElement("a");
    gridItem.classList.add("grid-item");
    /*gridItem.target = "_blank";*/

    var index = events.indexOf(event);
    gridItem.addEventListener('click', () => {
        window.parent.location.href = "details.html?index=" + index;
    })

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    gridItem.appendChild(overlay);

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = event.title;

    const location = document.createElement("div");
    location.classList.add("location");
    location.textContent = event.location;

    const date = document.createElement("div");
    date.classList.add("date");
    date.textContent = event.date;

    /*gridItem.appendChild(image);*/
    overlay.appendChild(title);
    overlay.appendChild(location);
    overlay.appendChild(date);
    gridItem.style.backgroundImage = `url(${event.imageSrc})`;
    gridItem.style.backgroundSize = "cover"; 
    gridItem.style.backgroundRepeat = "no-repeat"; 

    if (i < 6)
        gridContainer1.appendChild(gridItem);
    else if (i < 12)
        gridContainer2.appendChild(gridItem);
    else
        gridContainer3.appendChild(gridItem);

    i++;
});