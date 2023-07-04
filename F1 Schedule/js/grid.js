document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_event_thumbnails')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function (data) {
            const gridContainer1 = document.getElementById("gridContainer1");
            const gridContainer2 = document.getElementById("gridContainer2");
            const gridContainer3 = document.getElementById("gridContainer3");

            let i = 0;

            data.forEach((event) => {
                const gridItem = document.createElement("a");
                gridItem.classList.add("grid-item");
                /*gridItem.target = "_blank";*/

                var index = data.indexOf(event);

                gridItem.addEventListener('click', () => {
                    window.parent.location.href = "details.html?index=" + index;
                })

                const overlay = document.createElement("div");
                overlay.classList.add("overlay");
                gridItem.appendChild(overlay);

                const title = document.createElement("div");
                title.classList.add("title");
                title.textContent = event[0];

                const location = document.createElement("div");
                location.classList.add("location");
                location.textContent = event[2];

                const date = document.createElement("div");
                date.classList.add("date");
                date.textContent = event[1];

                /*gridItem.appendChild(image);*/
                overlay.appendChild(title);
                overlay.appendChild(location);
                overlay.appendChild(date);
                gridItem.style.backgroundImage = `url(${event[3]})`;
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
        })
        .catch(function (error) {
            console.log(error);
        });
});