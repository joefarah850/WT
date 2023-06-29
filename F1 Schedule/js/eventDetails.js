/*const topDrivers = [
    {
        name: "Max Verstappen",
        nationality: "Dutch",
        team: "Red Bull Racing",
        points: "145",
        teamLogo: "../images/teams/red-bull-logo.jpg",
        flag: "../images/flags/Netherlands.jpg",
    },
    {
        name: "Lewis Hamilton",
        nationality: "British",
        team: "Mercedes",
        points: "138",
        teamLogo: "../images/teams/mercedes-logo.jpg",
        flag: "../images/flags/UnitedKingdom.jpg",
    },
    {
        name: "Lando Norris",
        nationality: "British",
        team: "McLaren",
        points: "101",
        teamLogo: "../images/teams/mclaren-logo.jpg",
        flag: "../images/flags/UnitedKingdom.jpg",
    },
    {
        name: "Charles Leclerc",
        nationality: "Monegasque",
        team: "Ferrari",
        points: "92",
        teamLogo: "../images/teams/ferrari-logo.jpg",
        flag: "../images/flags/Monaco.jpg",
    },
    {
        name: "Sergio Perez",
        nationality: "Mexican",
        team: "Red Bull Racing",
        points: "84",
        teamLogo: "../images/teams/red-bull-logo.jpg",
        flag: "../images/flags/Mexico.jpg",
    },
];*/

function updateEventDetails(index) {
    fetch('http://localhost:5000/get_event_details')
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function (data) {
            const desc = document.querySelector('.desc');
            desc.innerHTML = '';


            const event = data[index];

            const description = document.createElement('p');
            description.classList.add('description');
            description.textContent = event[5]; // .description;

            const banner = document.querySelector('.banner');
            banner.style.backgroundImage = `url(${event[4]})`

            const raceName = document.createElement('div');
            raceName.classList.add('race-name');
            raceName.textContent = event[1]; //.title;

            const date = document.createElement('div');
            date.classList.add('race-date');
            date.textContent = event[2]; //.date;

            const location = document.createElement('div');
            location.classList.add('race-location');
            location.textContent = event[3]; //.location;

            const overlay = document.createElement("div");
            overlay.classList.add("banner-overlay");

            desc.appendChild(description);
            overlay.appendChild(raceName);
            overlay.appendChild(date);
            overlay.appendChild(location);
            banner.appendChild(overlay);

            const map = document.querySelector('.map');
            map.src = event[6]; //.mapSrc;
            map.style.border = '0';
            map.allowFullscreen = "";
            map.loading = "lazy";
            map.referrerPolicy = "no-referrer-when-downgrade";
        })
        .catch(function (error) {
            console.log(error);
        });

    // drivers table
    fetch(`http://localhost:5000/get_drivers/${index}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function (data) {
            console.log(data);
            const tableContainer = document.createElement("div");
            tableContainer.classList.add("table-container");

            const table = document.createElement("table");
            table.classList.add("drivers-table");

            const tableHeader = document.createElement("thead");
            const headerRow = document.createElement("tr");
            const headers = ["", "Name", "Nationality", "Team", "Points"];

            headers.forEach((headerText) => {
                const th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });

            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement("tbody");

            data.forEach(function (driver, position) {
                
                const row = document.createElement("tr");

                const positionCell = document.createElement("td");
                positionCell.textContent = position + 1;
                row.appendChild(positionCell);

                const nameCell = document.createElement("td");
                nameCell.classList.add("driver-name");
                nameCell.textContent = driver[0]; //.name;
                row.appendChild(nameCell);

                const nationalityContainer = document.createElement("div");
                nationalityContainer.classList.add("nationality-container");

                const nationalityCell = document.createElement("td");
                nationalityCell.classList.add("nationality-cell");

                const nationalityName = document.createElement("span");
                nationalityName.classList.add("nationality-name");
                nationalityName.textContent = driver[1]; //.nationality;

                const nationalityLogo = document.createElement("img")
                nationalityLogo.classList.add("nationality-logo");
                nationalityLogo.src = driver[2]; //.flag;

                nationalityContainer.appendChild(nationalityLogo);
                nationalityContainer.appendChild(nationalityName);
                nationalityCell.appendChild(nationalityContainer);
                row.appendChild(nationalityCell);

                const teamContainer = document.createElement("div");
                teamContainer.classList.add("team-container");

                const teamCell = document.createElement("td");
                teamCell.classList.add("team-cell");

                const teamName = document.createElement("span");
                teamName.classList.add("team-name");
                teamName.textContent = driver[3]; //.team;

                const teamLogo = document.createElement("img")
                teamLogo.classList.add("team-logo");
                teamLogo.src = driver[4]; //.teamLogo;

                teamContainer.appendChild(teamLogo);
                teamContainer.appendChild(teamName);
                teamCell.appendChild(teamContainer);
                row.appendChild(teamCell);

                const pointsCell = document.createElement("td");
                pointsCell.classList.add("points");
                pointsCell.textContent = driver[5]; //.points;
                row.appendChild(pointsCell);

                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);
            tableContainer.appendChild(table);

            const driversContainer = document.querySelector(".drivers");
            driversContainer.appendChild(tableContainer);
        })
        .catch(function (error) {
            console.log(error);
        });
}

var url = document.URL;
var currentPage = url.split("=").pop();
updateEventDetails(currentPage);