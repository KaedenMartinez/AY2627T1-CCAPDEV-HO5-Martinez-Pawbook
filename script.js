
const months = ["January", "February", "March", "April", "May", "June"];

const services = ["Full Grooming", "Basic Grooming", "Bathing", "Nail Trimming"];

const colors = ["#78977c", "#a8b99b", "#d8a76c", "#9aada1"];

const bookings = [
    [12, 10, 7, 5],
    [13, 10, 8, 5],
    [14, 10, 8, 5],
    [14, 11, 8, 5],
    [15, 11, 8, 6],
    [17, 13, 9, 6]
];

const ratings = [
    [4.2, 4.3, 4.1, 4.5, 4.7, 4.8],
    [4.1, 4.2, 4.0, 4.3, 4.5, 4.6],
    [4.0, 4.1, 3.9, 4.2, 4.4, 4.5],
    [4.1, 4.2, 4.0, 4.4, 4.6, 4.7]
];

const serviceFilter = document.getElementById("serviceFilter");
const monthFilter = document.getElementById("monthFilter");

const totalBookings = document.getElementById("totalBookings");
const averageRating = document.getElementById("averageRating");
const categoryCount = document.getElementById("categoryCount");
const mixLegend = document.getElementById("mixLegend");

function getTotals() {
    let totals = [0, 0, 0, 0];
    let start = 6 - Number(monthFilter.value);

    for (let i = start; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            totals[j] += bookings[i][j];
        }
    }

    return totals;
}

function updatePage() {
    let totals = getTotals();
    let total = 0;

    for (let i = 0; i < 4; i++) {
        total += totals[i];
    }

    totalBookings.textContent = total;
    categoryCount.textContent = 4;

    let ratingTotal = 0;
    let ratingCount = 0;
    let start = 6 - Number(monthFilter.value);

    for (let i = 0; i < 4; i++) {
        if (serviceFilter.value == "all" || serviceFilter.value == i) {
            for (let j = start; j < 6; j++) {
                ratingTotal += ratings[i][j];
                ratingCount++;
            }
        }
    }

    averageRating.innerHTML = (ratingTotal / ratingCount).toFixed(2) + " <small>/ 5</small>";

    servicesChart.data.datasets[0].data = totals;
    servicesChart.update();

    mixChart.data.datasets[0].data = totals;
    mixChart.update();

    mixLegend.innerHTML = "";

    for (let i = 0; i < 4; i++) {
        let percent = (totals[i] / total * 100).toFixed(1);

        mixLegend.innerHTML += `
            <div class="legend-item">
                <span class="legend-color" style="background:${colors[i]}"></span>
                <span class="legend-name">${services[i]}</span>
                <span class="legend-value">${percent}%</span>
            </div>
        `;
    }

    let chartMonths = months.slice(start);
    ratingsChart.data.labels = chartMonths;
    ratingsChart.data.datasets = [];

    for (let i = 0; i < 4; i++) {
        if (serviceFilter.value == "all" || serviceFilter.value == i) {
            ratingsChart.data.datasets.push({
                label: services[i],
                data: ratings[i].slice(start),
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: 2,
                pointRadius: 4,
                tension: 0.3
            });
        }
    }

    ratingsChart.update();
}

const servicesChart = new Chart(document.getElementById("servicesChart"), {
    type: "bar",
    data: {
        labels: services,
        datasets: [{
            label: "Bookings",
            data: [0, 0, 0, 0],
            backgroundColor: colors,
            borderRadius: 5
        }]
    },
    options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
});

const ratingsChart = new Chart(document.getElementById("ratingsChart"), {
    type: "line",
    data: {
        labels: months,
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom"
            }
        },
        scales: {
            y: {
                min: 3,
                max: 5
            }
        }
    }
});

const mixChart = new Chart(document.getElementById("mixChart"), {
    type: "doughnut",
    data: {
        labels: services,
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: colors,
            borderWidth: 3,
            borderColor: "white"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

serviceFilter.addEventListener("change", updatePage);
monthFilter.addEventListener("change", updatePage);

document.getElementById("resetFilters").addEventListener("click", function() {
    serviceFilter.value = "all";
    monthFilter.value = "6";
    updatePage();
});

updatePage();