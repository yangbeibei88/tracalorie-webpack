import Storage from "./Storage";

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCalorieLimit();
    this._renderStats();

    document.getElementById("limit").value = this._calorieLimit;
  }

  // Public Methods / API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._renderStats();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._renderStats();
    }
  }
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._renderStats();
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._renderStats();
  }

  resetDay() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._renderStats();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCalorieLimit();
    this._renderStats();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  // Private methods

  _displayCaloriesTotal() {
    const caloriesTotal = document.getElementById("calories-total");
    caloriesTotal.textContent = this._totalCalories;
  }

  _displayCalorieLimit() {
    const dailyCalorieLimitEl = document.getElementById("calories-limit");
    dailyCalorieLimitEl.textContent = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");

    caloriesConsumedEl.textContent = this._meals.reduce((total, meal) => {
      return total + meal.calories;
    }, 0);
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    caloriesBurnedEl.textContent = this._workouts.reduce((total, workout) => {
      return total + workout.calories;
    }, 0);
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.textContent = remaining;

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.className =
        "card bg-danger";
    } else {
      caloriesRemainingEl.parentElement.parentElement.className =
        "card bg-light";
    }
  }

  _displayCaloriesProgress() {
    const progressbarEl = document.getElementById("calorie-progress");

    if (this._totalCalories >= this._calorieLimit) {
      progressbarEl.classList.add("bg-danger");
      progressbarEl.style.width = "100%";
    } else {
      progressbarEl.classList.remove("bg-danger");
      progressbarEl.classList.add("bg-success");
      progressbarEl.style.width = `${
        (this._totalCalories / this._calorieLimit) * 100
      }%`;
    }
  }
  _displayNewMeal(meal) {
    const mealItems = document.getElementById("meal-items");
    const div = document.createElement("div");
    div.setAttribute("data-id", meal.id);
    div.innerHTML = `            <div class="card-body">
    <div
      class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
        ${meal.calories}
      </div>
      <button
        class="delete btn btn-danger btn-sm mx-2">
        <i
          class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`;
    div.className = "card my-2";
    mealItems.appendChild(div);
  }
  _displayNewWorkout(workout) {
    const workoutItems = document.getElementById("workout-items");
    const div = document.createElement("div");
    div.setAttribute("data-id", workout.id);
    div.innerHTML = `            <div class="card-body">
    <div
      class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
        ${workout.calories}
      </div>
      <button
        class="delete btn btn-danger btn-sm mx-2">
        <i
          class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`;
    div.className = "card my-2";
    workoutItems.appendChild(div);
  }

  _renderStats() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    this._displayCalorieLimit();
  }
}

export default CalorieTracker;
