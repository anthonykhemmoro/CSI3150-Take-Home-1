document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filterForm");
  const resetBtn = document.getElementById("resetBtn");
  const carListings = document.getElementById("carListings");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const resultsCount = document.getElementById("resultsCount");
  const makeOptions = document.getElementById("makeOptions");
  const colorOptions = document.getElementById("colorOptions");
//this shows the checkboxes
  createCheckboxes();
  //this loads up all the cars
  renderCars(usedCars);
//this is what happens for the filters
  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const filteredCars = filterCars();
    renderCars(filteredCars);
  });
  //this is the filyer reset
  resetBtn.addEventListener("click", function () {
    filterForm.reset();
    renderCars(usedCars);
  });

  function createCheckboxes() {
    const makes = [...new Set(usedCars.map(function (car) {
      return car.make;
    }))].sort();

    const colors = [...new Set(usedCars.map(function (car) {
      return car.color;
    }))].sort();

    makes.forEach(function (make) {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" name="make" value="${make}">
        ${make}
      `;
      makeOptions.appendChild(label);
    });

    colors.forEach(function (color) {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" name="color" value="${color}">
        ${color}
      `;
      colorOptions.appendChild(label);
    });
  }

  function getSelectedValues(name) {
    const checkedBoxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkedBoxes).map(function (box) {
      return box.value;
    });
  }
// this is how the filter works on the way you input it with the checkboxes
  function filterCars() {
    const minYear = Number(document.getElementById("minYear").value) || 0;
    const maxYear = Number(document.getElementById("maxYear").value) || Infinity;
    const maxMileage = Number(document.getElementById("maxMileage").value) || Infinity;
    const minPrice = Number(document.getElementById("minPrice").value) || 0;
    const maxPrice = Number(document.getElementById("maxPrice").value) || Infinity;

    const selectedMakes = getSelectedValues("make");
    const selectedColors = getSelectedValues("color");

    return usedCars.filter(function (car) {
      const matchesYear = car.year >= minYear && car.year <= maxYear;
      const matchesMileage = car.mileage <= maxMileage;
      const matchesPrice = car.price >= minPrice && car.price <= maxPrice;

      const matchesMake =
        selectedMakes.length === 0 || selectedMakes.includes(car.make);

      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(car.color);

      return (
        matchesYear &&
        matchesMileage &&
        matchesPrice &&
        matchesMake &&
        matchesColor
      );
    });
  }
  //this shows the cars post filter
  function renderCars(cars) {
    carListings.innerHTML = "";
      //this is for when no cars match the filter
    if (cars.length === 0) {
      noResultsMessage.classList.remove("hidden");
      resultsCount.textContent = "0 cars found";
      return;
    }

    noResultsMessage.classList.add("hidden");
    resultsCount.textContent = cars.length + (cars.length === 1 ? " car found" : " cars found");
      //this is for each of the cars cards.
    cars.forEach(function (car) {
      const card = document.createElement("article");
      card.className = "car-card";

      card.innerHTML = `
        <img class="car-image" src="${car.image}" alt="${car.year} ${car.make} ${car.model}">
        <div class="car-card-body">
          <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
          <p class="price">$${car.price.toLocaleString()}</p>
          <p><strong>Mileage:</strong> ${car.mileage.toLocaleString()} miles</p>
          <p><strong>Color:</strong> ${car.color}</p>
          <p><strong>Fuel Economy:</strong> ${car.gasMileage}</p>
        </div>
      `;

      carListings.appendChild(card);
    });
  }
});