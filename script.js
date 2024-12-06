
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
