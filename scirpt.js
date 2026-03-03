let totalSlots = 6;
let parkingData = JSON.parse(localStorage.getItem("parkingData")) || [];

function loadSlots() {
    let container = document.getElementById("parkingSlots");
    container.innerHTML = "";

    for (let i = 1; i <= totalSlots; i++) {
        let slot = document.createElement("div");
        slot.className = "col-md-4";

        let card = document.createElement("div");
        card.className = "slot bg-success text-white";
        card.innerHTML = "Slot " + i;

        card.onclick = function () {
            parkVehicle(i);
        };

        slot.appendChild(card);
        container.appendChild(slot);
    }
}

function parkVehicle(slotNumber) {
    let now = new Date().toLocaleString();

    parkingData.push({
        slot: slotNumber,
        parkedAt: now
    });

    localStorage.setItem("parkingData", JSON.stringify(parkingData));

    alert("Vehicle Parked at Slot " + slotNumber + "\nTime: " + now);
}

function showFeedback() {
    alert("Feedback feature coming soon!");
}

function openLogin() {
    let modal = new bootstrap.Modal(document.getElementById("loginModal"));
    modal.show();
}

function createAccount() {
    let user = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        vehicleName: document.getElementById("vehicleName").value,
        vehicleNumber: document.getElementById("vehicleNumber").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Account Created Successfully!");
    location.reload();
}

loadSlots();