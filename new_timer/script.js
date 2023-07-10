// Pomodoro

//находим элементы
const btn = document.getElementById('btn');
const pom = document.getElementById('work');
const short = document.getElementById('short');
const long = document.getElementById('long');
const timer = document.getElementById('timer');
const btnAded = document.querySelector('.btn_add');
const btnRemove = document.querySelector('.btn_remove');
const btnReset = document.querySelector('#btn_reset');

let time = 1500;
let timeBlock;
// изменение количества минут для счетчиков
btnAded.addEventListener('click', () => {
  time += 60;
  date();
});
btnRemove.addEventListener('click', () => {
  time -= 60;
  if (time === 0) {
    time += 60;
  }
  date();
});

let mode = 'work';
let pn = 0;

const timeAmount = {
  work: 1500,
  shortBreak: 300,
  longBreak: 900,
};
//вывод таймера
function date() {
  min = parseInt((time / 60) % 60);
  sec = parseInt(time % 60);
  sec = sec < 10 ? '0' + sec : sec;
  timeBlock = `${Math.trunc(min)}:${sec}`;
  timer.innerHTML = timeBlock;
  stop();
}

let openStart = false;
let timeOut;
// функция обработки циклов Помодоро
function stop() {
  if (time === 0) {
    if (mode === 'work') {
      if (pn < 1) {
        mode = 'shortBreak';
        openStart = true;
        shorten();
      } else {
        mode = 'longBreak';
        openStart = true;
        longen();
      }
    } else {
      mode = 'work';
      openStart = true;
      poma();
    }
    start();
    pn++;
  }
}
// запуск самого таймера
function start() {
  if (!openStart) {
    btn.innerHTML = 'Stop';
    timeOut = setInterval(() => {
      console.log(mode);
      --time;
      date();
    }, 1000);
    openStart = true;
  } else {
    btn.innerHTML = 'Start';
    clearInterval(timeOut);
    openStart = false;
  }
}
// пауза в таймере
btn.addEventListener('click', () => {
  btn.innerHTML = 'Stop';
  btn.classList.toggle('btn_start_action');
  start();
});

function component() {
  openStart = false;
  date();
  clearInterval(timeOut);
}
// функции для обработки каждого из счетчиков
function poma() {
  pom.classList.add('block_active');
  classBtn(short, long, pom);
  mode = 'work';
  time = timeAmount[mode];
  component();
}
function shorten() {
  short.classList.add('block_active');
  classBtn(pom, long, short);
  mode = 'shortBreak';
  time = timeAmount[mode];
  component();
}

function longen() {
  long.classList.add('block_active');
  classBtn(pom, short, long);
  mode = 'longBreak';
  time = timeAmount[mode];
  component();
}
// переключение между счетчиками
function classBtn(a, b, c) {
  btn.innerHTML = 'Start';
  btn.classList.remove('btn_start_action');
  if (a.classList.contains('block_active') || b.classList.contains('block_active')) {
    c.classList.add('block_active');
    a.classList.remove('block_active');
    b.classList.remove('block_active');
  }
}
// Для кнопки reset
btnReset.addEventListener('click', () => {
  btn.innerHTML = 'Start';
  poma();
});




//TODO

//Находим Элемент
const form = document.querySelector('#form');
const add = document.querySelector('.btn_todo');
const taskInput = document.querySelector('#task_input');
const taskList = document.querySelector('.task_list');
const blockTo = document.querySelector('.block_todoss');
const btnAdd = document.querySelector('.btn_started');
const blockStart = document.querySelector('.block_todo');
const btnTodo = document.querySelector('.btn_todo');

let coment = `<textarea id="text_add" cols="30" rows="10" class="text_block added"   type="text"></textarea>`;
let todo_value = '';
blockTo.innerHTML = coment;
let add_coment = document.getElementById('text_add');

btnTodo.addEventListener('click', (event) => {
  if (event.target.dataset.action === 'add_todo') {
    event.preventDefault();
    add_coment.classList.toggle('added');
  }
});

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

//вызов ToDo
btnAdd.addEventListener('click', () => {
  form.classList.toggle('form_block');
});

form.addEventListener('submit', addTask);

// удаление Задачи

taskList.addEventListener('click', deleteTask);

function deleteTask(event) {
  if (event.target.dataset.action === 'delete') {
    const parentNode = event.target.closest('li');
    const id = Number(parentNode.id);
    tasks = tasks.filter((task) => task.id !== id);
    saveTolocalStorage();

    parentNode.remove();
  }
}

function addTask(event) {
  event.preventDefault();

  // Достаем текст
  todo_value = add_coment.value;
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    valued: todo_value,
  };

  console.log(taskText);

  tasks.push(newTask);
  saveTolocalStorage();

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();
  add_coment.value = '';
  add_coment.focus();
}
//Отмечаем Задачу завершенной
taskList.addEventListener('click', doneTask);

function doneTask(event) {
  if (event.target.dataset.action === 'done') {
    const parentNode = event.target.closest('li');
    const taskTitle = parentNode.querySelector('span');
    taskTitle.classList.toggle('task_title_done');
    const id = parentNode.id;
    const task = tasks.find((task) => task.id == id);
    task.done = !task.done;
    saveTolocalStorage();
  }
}

//это для кнопки вызова коментариев

taskList.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'btn_open') {
    const parentNode = e.target.closest('li');
    const coment = parentNode.querySelector('textarea');
    console.log(coment);
    coment.classList.toggle('coment');
  }
});

function saveTolocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
//рендер Todo
function renderTask(task) {
  const cssClass = task.done ? ' task_title_done' : '';

  const taskHTML = `<li  class ="empti_list"id="${task.id}">
  <div class="todo_iner">
  <span  id = "task_span"class=" ${cssClass}">${task.text}</span>
  <div>
  <button data-action="done" class="btn_action">done</button>
 <button data-action="delete"class="btn_action">delete</button>
  </div>
  </div>
  <div class="change_block">
  <button data-action="btn_open" class="btn_change_add">Add Task</button>
  <textarea  class="coment coment_add"   type="text" > ${task.valued}</textarea>
  </div>

 
  </li>`;

  taskList.insertAdjacentHTML('beforeend', taskHTML);
}
