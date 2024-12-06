// DOM Elements
const todayDateElement = document.getElementById("today-date");
const habitListElement = document.getElementById("habit-list");
const addHabitButton = document.getElementById("add-habit");
const calendarContainer = document.getElementById("calendar-container");
const todoItemsElement = document.getElementById("todo-items");
const addTodoButton = document.getElementById("add-todo");
const xpDisplay = document.getElementById("xp-display");
const levelDisplay = document.getElementById("level-display");
const progressBarFill = document.getElementById("progress-fill");
const rewardContainer = document.getElementById("reward-container");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Global Variables
let habits = {}; // Stores habits with their dates and completion status
let todos = {}; // Stores to-do lists by date
let xp = 0; // User's XP
let level = 1; // User's level
let today = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

// Initialize App
function init() {
  displayDate();
  loadHabits();
  loadTodos();
  updateProgress();
  setupTabNavigation();
}

// Display Today's Date
function displayDate() {
  todayDateElement.textContent = today;
}

// Habit Tracker Logic
function loadHabits() {
  habitListElement.innerHTML = "";
  const dailyHabits = habits[today] || [];

  dailyHabits.forEach((habit, index) => {
    const habitDiv = document.createElement("div");
    habitDiv.innerHTML = `
      <span>${habit.name}</span>
      <button onclick="markHabitComplete(${index})" ${
      habit.completed ? "disabled" : ""
    }>
        ${habit.completed ? "Completed" : "Mark as Complete"}
      </button>
    `;
    habitListElement.appendChild(habitDiv);
  });
}

function addHabit() {
  const habitName = prompt("Enter a new habit:");
  if (habitName) {
    if (!habits[today]) habits[today] = [];
    habits[today].push({ name: habitName, completed: false });
    saveData();
    loadHabits();
  }
}

function markHabitComplete(index) {
  if (habits[today]) {
    habits[today][index].completed = true;
    xp += 10; // Award XP for completing a habit
    checkLevelUp();
    saveData();
    loadHabits();
    updateProgress();
  }
}

// Calendar Logic
function loadTodos() {
  todoItemsElement.innerHTML = "";
  const dailyTodos = todos[today] || [];

  dailyTodos.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.className = todo.completed ? "completed" : "";
    todoItem.innerHTML = `
      ${todo.name}
      <button onclick="toggleTodoCompletion(${index})">✔️</button>
      <button onclick="deleteTodo(${index})">❌</button>
    `;
    todoItemsElement.appendChild(todoItem);
  });
}

function addTodo() {
  const todoName = prompt("Enter a new to-do item:");
  if (todoName) {
    if (!todos[today]) todos[today] = [];
    todos[today].push({ name: todoName, completed: false });
    saveData();
    loadTodos();
  }
}

function toggleTodoCompletion(index) {
  if (todos[today]) {
    todos[today][index].completed = !todos[today][index].completed;
    saveData();
    loadTodos();
  }
}

function deleteTodo(index) {
  if (todos[today]) {
    todos[today].splice(index, 1);
    saveData();
    loadTodos();
  }
}

// Reward Shop Logic
function checkLevelUp() {
  const nextLevelXP = level * 100;
  if (xp >= nextLevelXP) {
    xp -= nextLevelXP;
    level++;
    alert("Congratulations! You've leveled up!");
  }
}

function updateProgress() {
  xpDisplay.textContent = xp;
  levelDisplay.textContent = level;
  const progressPercent = (xp / (level * 100)) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
}

function loadRewards() {
  rewardContainer.innerHTML = ""; // Clear rewards
  const rewards = ["Anime PFP 1", "Anime PFP 2", "Avatar Upgrade"]; // Example rewards
  rewards.forEach((reward) => {
    const rewardDiv = document.createElement("div");
    rewardDiv.textContent = reward;
    rewardContainer.appendChild(rewardDiv);
  });
}

// Tab Navigation Logic
function setupTabNavigation() {
  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) =>
        content.classList.remove("active")
      );

      button.classList.add("active");
      tabContents[index].classList.add("active");
    });
  });
}

// Save and Load Data
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function loadData() {
  habits = JSON.parse(localStorage.getItem("habits")) || {};
  todos = JSON.parse(localStorage.getItem("todos")) || {};
  xp = parseInt(localStorage.getItem("xp")) || 0;
  level = parseInt(localStorage.getItem("level")) || 1;
}

// Initialize App
loadData();
init();

// Event Listeners
addHabitButton.addEventListener("click", addHabit);
addTodoButton.addEventListener("click", addTodo);
