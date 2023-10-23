import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import "./css/bootstrap.css";
import "./css/style.css";
import CalorieTracker from "./Tracker";
import { Meal, Workout } from "./Item";

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();

    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calories.value);

      this._tracker.addMeal(meal);
    } else if (type === "workout") {
      const workout = new Workout(name.value, +calories.value);

      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";
    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new Collapse(collapseItem, { toggle: true });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?") == true) {
        const id = e.target.closest(".card").getAttribute("data-id");
        console.log(id);
        if (type === "meal") {
          this._tracker.removeMeal(id);
        } else {
          this._tracker.removeWorkout(id);
        }
        e.target.closest(".card").remove();
      } else {
        return;
      }
    }
  }

  _filterItems(type, e) {
    const filterText = e.target.value.toLowerCase();
    console.log(filterText);
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(filterText) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset(e) {
    this._tracker.resetDay();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");
    if (limit.value !== "") {
      this._tracker.setLimit(+limit.value);
      limit.value = "";
    } else {
      alert("Please set your daily calorie limit.");
      return;
    }

    const modalEl = document.getElementById("limit-modal");
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
