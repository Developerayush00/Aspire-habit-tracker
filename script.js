// DOM Elements
const todayDateElement = document.getElementById("today-date");
const miniCalendarElement = document.getElementById("mini-calendar");
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
let streaks = {}; // Tracks streaks for each habit
let xp = 100; // User's XP (default 100)
let level = 1; // User's level
let today = new Date().toISOString().split("T")[0]; // Current date (YYYY-MM-DD)

// Initialize App
function init() {
  displayDate();
  loadHabits();
  loadTodos();
  updateProgress();
  loadRewards();
  setupTabNavigation();
}

// Display Today's Date with Mini Calendar
function displayDate() {
  todayDateElement.innerHTML = `${today} <span class="emoji" id="calendar-icon">🗓️</span>`;
  const calendarIcon = document.getElementById("calendar-icon");
  calendarIcon.addEventListener("click", toggleMiniCalendar);

  // Close mini-calendar when clicking outside
  document.addEventListener("click", (event) => {
    if (!miniCalendarElement.contains(event.target) && event.target !== calendarIcon) {
      miniCalendarElement.style.display = "none";
    }
  });
}

// Mini Calendar Logic
function toggleMiniCalendar() {
  miniCalendarElement.style.display =
    miniCalendarElement.style.display === "block" ? "none" : "block";
}

// Habit Tracker Logic
function loadHabits() {
  habitListElement.innerHTML = "";
  const dailyHabits = habits[today] || [];

  dailyHabits.forEach((habit, index) => {
    const streakCount = streaks[habit.name] || 0;
    const habitDiv = document.createElement("div");
    habitDiv.className = "habit-item";
    habitDiv.innerHTML = `
      <span class="habit-name">${habit.name} <span class="streak">🔥${streakCount}</span></span>
      <button onclick="markHabitComplete(${index})" ${
      habit.completed ? "disabled" : ""
    }>✔️</button>
      <button onclick="editHabit(${index})">✏️</button>
      <button onclick="deleteHabit(${index})">❌</button>
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
    const habitName = habits[today][index].name;

    // Update streak
    streaks[habitName] = (streaks[habitName] || 0) + 1;

    // Award XP
    xp += 15;
    checkLevelUp();
    saveData();
    loadHabits();
    updateProgress();
  }
}

function editHabit(index) {
  const newName = prompt("Edit habit name:", habits[today][index].name);
  if (newName) {
    const oldName = habits[today][index].name;
    habits[today][index].name = newName;

    // Transfer streak to the new habit name
    streaks[newName] = streaks[oldName] || 0;
    delete streaks[oldName];

    saveData();
    loadHabits();
  }
}

function deleteHabit(index) {
  if (habits[today]) {
    const habitName = habits[today][index].name;
    delete streaks[habitName];
    habits[today].splice(index, 1);
    saveData();
    loadHabits();
  }
}
// Calendar Tab Logic
function loadCalendar() {
  const calendar = generateCalendarHTML();
  calendarContainer.innerHTML = calendar;
}

function generateCalendarHTML() {
  const selectedDate = new Date(today);
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  let html = `<div class="calendar-header">
                <button onclick="navigateCalendar(-1)">◀️</button>
                <span>${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getFullYear()}</span>
                <button onclick="navigateCalendar(1)">▶️</button>
              </div>
              <div class="calendar-grid">`;
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  daysOfWeek.forEach((day) => (html += `<div class="calendar-day">${day}</div>`));

  for (let i = 0; i < firstDay.getDay(); i++) html += `<div class="calendar-empty"></div>`;

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toISOString().split("T")[0];
    const highlight = currentDay === today ? "highlight" : "";
    html += `<div class="calendar-date ${highlight}" onclick="loadTodosForDate('${currentDay}')">${day}</div>`;
  }

  html += `</div>`;
  return html;
}

function navigateCalendar(offset) {
  const current = new Date(today);
  const newMonth = new Date(current.getFullYear(), current.getMonth() + offset, 1);
  today = newMonth.toISOString().split("T")[0];
  loadCalendar();
}

function loadTodosForDate(date) {
  today = date;
  loadTodos();
}

// Reward Tab Logic
function loadRewards() {
  rewardContainer.innerHTML = `
    <div class="xp-info">
      XP: ${xp} | Level: ${level}
      <div class="progress-bar">
        <div id="progress-fill" style="width: ${calculateProgress()}%;"></div>
      </div>
    </div>
    <div class="reward-items">
      <div class="reward-item">
        <img src="path/to/image1.png" alt="Reward 1" />
        <p>Reward 1 (50 XP)</p>
        <button onclick="redeemReward(50)">Redeem</button>
      </div>
      <div class="reward-item">
        <img src="path/to/image2.png" alt="Reward 2" />
        <p>Reward 2 (100 XP)</p>
        <button onclick="redeemReward(100)">Redeem</button>
      </div>
      <!-- Add more rewards as needed -->
    </div>
  `;
}

function calculateProgress() {
  return Math.min(((xp - (level - 1) * 100) / 100) * 100, 100);
}

function redeemReward(cost) {
  if (xp >= cost) {
    xp -= cost;
    alert("Reward Redeemed!");
    updateProgress();
    loadRewards();
  } else {
    alert("Not enough XP!");
  }
}

// Level Up Logic
function checkLevelUp() {
  if (xp >= level * 100) {
    level++;
    alert("Level Up!");
  }
}

function updateProgress() {
  levelDisplay.innerText = `Level ${level}`;
  xpDisplay.innerText = `XP: ${xp}`;
  progressBarFill.style.width = `${calculateProgress()}%`;
}

// Data Persistence
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("streaks", JSON.stringify(streaks));
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function loadData() {
  habits = JSON.parse(localStorage.getItem("habits")) || {};
  todos = JSON.parse(localStorage.getItem("todos")) || {};
  streaks = JSON.parse(localStorage.getItem("streaks")) || {};
  xp = parseInt(localStorage.getItem("xp")) || 100;
  level = parseInt(localStorage.getItem("level")) || 1;
}
