// Initialize data
let habits = JSON.parse(localStorage.getItem('habits')) || {};
let todos = JSON.parse(localStorage.getItem('todos')) || {};
let userXP = parseInt(localStorage.getItem('xp')) || 0;
let userLevel = parseInt(localStorage.getItem('level')) || 1;

// Utility Functions
const today = new Date().toISOString().split('T')[0];
document.getElementById('today-date').innerText = today;

function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('xp', userXP);
  localStorage.setItem('level', userLevel);
}

// Habit Tracker
function renderHabits(date = today) {
  const habitList = document.getElementById('habit-list');
  habitList.innerHTML = '';

  const dailyHabits = habits[date] || [];
  dailyHabits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.innerHTML = `
      <span>${habit.name} - Streak: ${habit.streak}</span>
      <button onclick="markHabit('${date}', ${index})">Mark Complete</button>
      <button onclick="deleteHabit('${date}', ${index})">Delete</button>
    `;
    habitList.appendChild(habitItem);
  });
}

function markHabit(date, index) {
  if (!habits[date]) return;
  habits[date][index].streak++;
  userXP += 10;
  updateProgress();
  saveData();
  renderHabits(date);
}

function deleteHabit(date, index) {
  habits[date].splice(index, 1);
  saveData();
  renderHabits(date);
}

document.getElementById('add-habit').addEventListener('click', () => {
  const habitName = prompt('Enter habit name:');
  if (!habits[today]) habits[today] = [];
  habits[today].push({ name: habitName, streak: 0 });
  saveData();
  renderHabits();
});

// Calendar
function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = 'Calendar UI Here';
}

function renderToDos(date = today) {
  const todoItems = document.getElementById('todo-items');
  todoItems.innerHTML = '';

  (todos[date] || []).forEach((todo, index) => {
    const todoItem = document.createElement('li');
    todoItem.innerHTML = `
      <span>${todo.task}</span>
      <button onclick="deleteToDo('${date}', ${index})">Delete</button>
    `;
    todoItems.appendChild(todoItem);
  });
}

function deleteToDo(date, index) {
  todos[date].splice(index, 1);
  saveData();
  renderToDos(date);
}

document.getElementById('add-todo').addEventListener('click', () => {
  const task = prompt('Enter to-do:');
  if (!todos[today]) todos[today] = [];
  todos[today].push({ task });
  saveData();
  renderToDos();
});

// Reward Shop
function updateProgress() {
  const progressFill = document.getElementById('progress-fill');
  const xpForNextLevel = userLevel * 100;
  const progressPercent = (userXP / xpForNextLevel) * 100;

  if (userXP >= xpForNextLevel) {
    userLevel++;
    userXP = 0;
  }

  progressFill.style.width = `${progressPercent}%`;
  saveData();
}

// Initial Render
renderHabits();
renderToDos();
updateProgress();
