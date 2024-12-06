
// Tab Switching Logic
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((btn) => btn.classList.remove('active'));
        tabContents.forEach((content) => content.classList.remove('active'));

        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.getElementById(target).classList.add('active');
    });
});

// Habit Tracker Logic
let habits = JSON.parse(localStorage.getItem('habits')) || [];
function renderHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        const habitItem = document.createElement('div');
        habitItem.innerHTML = `
            <span>${habit.name} - Streak: ${habit.streak}</span>
            <button onclick="markHabit(${index})">Done</button>
            <button onclick="deleteHabit(${index})">Delete</button>
        `;
        habitList.appendChild(habitItem);
    });
}
function markHabit(index) {
    habits[index].streak++;
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}
function deleteHabit(index) {
    habits.splice(index, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}
document.getElementById('add-habit').addEventListener('click', () => {
    const habitName = prompt('Enter habit name:');
    habits.push({ name: habitName, streak: 0 });
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
});
renderHabits();

// Calendar To-Do Logic
const todos = JSON.parse(localStorage.getItem('todos')) || {};
function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = 'Calendar will go here';
}
function renderToDos(dateKey) {
    const todoItems = document.getElementById('todo-items');
    todoItems.innerHTML = '';
    (todos[dateKey] || []).forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.innerHTML = `
            <span>${todo}</span>
            <button onclick="deleteToDo('${dateKey}', ${index})">Delete</button>
        `;
        todoItems.appendChild(todoItem);
    });
}
function addToDo(dateKey) {
    const todo = prompt('Enter your to-do:');
    if (!todos[dateKey]) todos[dateKey] = [];
    todos[dateKey].push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderToDos(dateKey);
}
function deleteToDo(dateKey, index) {
    todos[dateKey].splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderToDos(dateKey);
}
document.getElementById('add-todo').addEventListener('click', () => {
    const dateKey = new Date().toDateString(); // Today's date as key
    addToDo(dateKey);
});
renderCalendar();
renderToDos(new Date().toDateString());
// Initialize data
let habits = JSON.parse(localStorage.getItem('habits')) || {};
let todos = JSON.parse(localStorage.getItem('todos')) || {};
let userXP = parseInt(localStorage.getItem('xp')) || 0;
let userLevel = parseInt(localStorage.getItem('level')) || 1;

// Date Utilities
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
document.getElementById('today-date').innerText = today;

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
  userXP += 10; // Earn XP for completing a habit
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

// Calendar To-Do List
function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = 'Calendar will go here';
}

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
  if (todos[date][index].completed) userXP += 5; // Earn XP for completing a to-do
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
