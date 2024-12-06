// Initialize Data
let habits = JSON.parse(localStorage.getItem('habits')) || {};
let todos = JSON.parse(localStorage.getItem('todos')) || {};
let userXP = parseInt(localStorage.getItem('xp')) || 0;
let userLevel = parseInt(localStorage.getItem('level')) || 1;

// Utilities
const today = new Date().toISOString().split('T')[0];
document.getElementById('today-date').innerText = today;

// Tabs
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Habit Tracker
function renderHabits(date = today) {
  const habitList = document.getElementById('habit-list');
  habitList.innerHTML = '';

  const dailyHabits = habits[date] || [];
  dailyHabits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.innerHTML = `
      <span>${habit.name} - Streak: ${habit.streak}</span>
      <button onclick="markHabit('${date}', ${index})">Done</button>
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
  if (!habits[date]) return;
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

// Calendar and To-Do List
function renderToDos(date = today) {
  const todoItems = document.getElementById('todo-items');
  todoItems.innerHTML = '';

  (todos[date] || []).forEach((todo, index) => {
    const todoItem = document.createElement('li');
    todoItem.className = todo.completed ? 'completed' : '';
    todoItem.innerHTML = `
      <span>${todo.task}</span>
      <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleToDo('${date}', ${index})" />
      <button onclick="deleteToDo('${date}', ${index})">Delete</button>
    `;
    todoItems.appendChild(todoItem);
  });
}

function toggleToDo(date, index) {
  todos[date][index].completed = !todos[date][index].completed;
  if (todos[date][index].completed) userXP += 5;
  updateProgress();
  saveData();
  renderToDos(date);
}

function deleteToDo(date, index) {
  todos[date].splice(index, 1);
  saveData();
  renderToDos(date);
}

document.getElementById('add-todo').addEventListener('click', () => {
  const task = prompt('Enter your to-do:');
  if (!todos[today]) todos[today] = [];
  todos[today].push({ task, completed: false });
  saveData();
  renderToDos();
});

// Reward Shop
function updateProgress() {
  const xpDisplay = document.getElementById('xp-display');
  const levelDisplay = document.getElementById('level-display');
  const progressFill = document.getElementById('progress-fill');

  xpDisplay.innerText = userXP;
  levelDisplay.innerText = userLevel;

  const xpForNextLevel = userLevel * 100;
  const progressPercent = (userXP / xpForNextLevel) * 100;

  if (userXP >= xpForNextLevel) {
    userLevel++;
    userXP = 0;
  }

  progressFill.style.width = `${progressPercent}%`;
  saveData();
}

// Save Data
function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('xp', userXP);
  localStorage.setItem('level', userLevel);
}

// Initial Render
renderHabits();
renderToDos();
updateProgress();
