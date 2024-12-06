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
  const calendarElement = document.createElement("div");
  calendarElement.className = "calendar";
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  // Display current month and year
  const monthYearDisplay = document.createElement("div");
  monthYearDisplay.className = "month-year";
  monthYearDisplay.innerText = `${getMonthName(currentMonth)} ${currentYear}`;
  calendarElement.appendChild(monthYearDisplay);

  const calendarGrid = document.createElement("div");
  calendarGrid.className = "calendar-grid";
  calendarElement.appendChild(calendarGrid);

  // Generate days of the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the current month

  // Fill calendar with day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.innerText = day;

    // Highlight today's date
    const today = new Date();
    if (today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
      dayElement.classList.add("today");
    }

    // Add click event to open to-do list for the day
    dayElement.addEventListener("click", () => openTodoList(currentYear, currentMonth, day));

    calendarGrid.appendChild(dayElement);
  }

  // Display the calendar on the page
  document.getElementById("calendar-container").innerHTML = "";
  document.getElementById("calendar-container").appendChild(calendarElement);
}

function getMonthName(monthIndex) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

function openTodoList(year, month, day) {
  const dateKey = `${year}-${month + 1}-${day}`; // Format as YYYY-MM-DD
  const todosForDate = todos[dateKey] || [];
  
  // Display the to-do list for that date
  const todoListDiv = document.createElement("div");
  todoListDiv.className = "todo-list";
  todoListDiv.innerHTML = `<h3>To-Do List for ${dateKey}</h3>`;

  todosForDate.forEach((todo, index) => {
    const todoItemDiv = document.createElement("div");
    todoItemDiv.className = "todo-item";
    todoItemDiv.innerHTML = `
      <span class="todo-name">${todo}</span>
      <button onclick="editTodo(${year}, ${month}, ${day}, ${index})">✏️</button>
      <button onclick="deleteTodo(${year}, ${month}, ${day}, ${index})">❌</button>
    `;
    todoListDiv.appendChild(todoItemDiv);
  });

  document.getElementById("calendar-container").appendChild(todoListDiv);
}

function editTodo(year, month, day, index) {
  const dateKey = `${year}-${month + 1}-${day}`;
  const newTodo = prompt("Edit To-Do:", todos[dateKey][index]);
  if (newTodo) {
    todos[dateKey][index] = newTodo;
    saveData();
    loadCalendar();
  }
}

function deleteTodo(year, month, day, index) {
  const dateKey = `${year}-${month + 1}-${day}`;
  todos[dateKey].splice(index, 1);
  saveData();
  loadCalendar();
}

// Reward Tab Logic
function loadRewards() {
  const rewardShop = [
    { name: "Anime Avatar", xpCost: 50 },
    { name: "Cool Profile Badge", xpCost: 100 },
    { name: "Superpower Boost", xpCost: 150 },
    // Add more rewards as needed
  ];

  rewardContainer.innerHTML = "<h3>Reward Shop</h3>";

  rewardShop.forEach((reward, index) => {
    const rewardDiv = document.createElement("div");
    rewardDiv.className = "reward-item";
    rewardDiv.innerHTML = `
      <span class="reward-name">${reward.name}</span>
      <span class="xp-cost">Cost: ${reward.xpCost} XP</span>
      <button onclick="redeemReward(${index}, ${reward.xpCost})">Redeem</button>
    `;
    rewardContainer.appendChild(rewardDiv);
  });
}

function redeemReward(index, xpCost) {
  if (xp >= xpCost) {
    xp -= xpCost;
    alert("Reward Redeemed!");
    updateProgress();
    loadRewards();
  } else {
    alert("Not enough XP to redeem this reward.");
  }
}

// XP System & Progress Update
function updateProgress() {
  xpDisplay.innerText = `XP: ${xp}`;
  levelDisplay.innerText = `Level: ${level}`;

  // Level Up Logic
  if (xp >= 500 && level === 1) {
    level = 2;
    alert("Congratulations! You've leveled up to Level 2!");
  } else if (xp >= 1000 && level === 2) {
    level = 3;
    alert("Congratulations! You've leveled up to Level 3!");
  }

  // Progress Bar
  const progress = (xp / 1000) * 100; // XP-to-Progress ratio
  progressBarFill.style.width = `${progress}%`;
  if (progress > 100) progressBarFill.style.width = "100%";
}

// Save Data to Local Storage
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("streaks", JSON.stringify(streaks));
  localStorage.setItem("xp", JSON.stringify(xp));
  localStorage.setItem("level", JSON.stringify(level));
}

// Load Data from Local Storage
function loadData() {
  habits = JSON.parse(localStorage.getItem("habits")) || {};
  todos = JSON.parse(localStorage.getItem("todos")) || {};
  streaks = JSON.parse(localStorage.getItem("streaks")) || {};
  xp = JSON.parse(localStorage.getItem("xp")) || 100;
  level = JSON.parse(localStorage.getItem("level")) || 1;
}

// Tab Navigation Logic
function setupTabNavigation() {
  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.add("hidden"));
      btn.classList.add("active");
      tabContents[index].classList.remove("hidden");
    });
  });
}

// Initialize Everything
init();
