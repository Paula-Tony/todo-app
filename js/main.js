let themeSwitcher = document.querySelector(".theme-icon");
let taskInput = document.getElementById("task-input");
let taskInputCheck = document.querySelector(".create-task .checked-input");
let tasksDiv = document.querySelector(".tasks-container .tasks");
let filterSpans = document.querySelectorAll(".filters span");
let allSpanFilter = document.querySelector(".filters .all");
let activeSpanFilter = document.querySelector(".filters .active");
let completedSpanFilter = document.querySelector(".filters .completed");
let clearCompleted = document.querySelector(".clear-completed");

themeSwitcher.onclick = (e) => {
  if (e.target.classList.contains("light")) {
    e.target.src = "../images/icon-sun.svg";
    e.target.classList.remove("light");
    window.localStorage.setItem("theme", "dark");
  } else {
    e.target.src = "../images/icon-moon.svg";
    e.target.classList.add("light");
    window.localStorage.setItem("theme", "light");
  }
  document.documentElement.classList.toggle("dark");
  document.querySelector(".header-img").classList.toggle("dark");
};

taskInput.onkeydown = (e) => {
  if (e.key === "Enter" && e.target.value != "") {
    createTask(e.target.value);
    e.target.value = "";
    taskInputCheck.checked = false;
  }
};

let arrayOfTasks = [];

function createTask(taskText) {
  let task = {
    id: Date.now(),
    title: taskText,
    completed: taskInputCheck.checked,
  };
  arrayOfTasks.push(task);
  addTasksToPage(arrayOfTasks);
  addTasksToLocalStorage(arrayOfTasks);
  leftedTasks(arrayOfTasks);
  clickActiveSpan();
  dragAndDrop();
}

function addTasksToPage(arrayOfTasks) {
  tasksDiv.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    let taskLi = document.createElement("li");
    taskLi.className = "task";
    taskLi.setAttribute("draggable", true);

    let checkedInput = document.createElement("input");
    checkedInput.className = "checked-input";
    checkedInput.id = `checked-input-${task.id}`;
    checkedInput.type = "checkbox";
    if (task.completed) {
      checkedInput.checked = true;
    }
    taskLi.appendChild(checkedInput);

    let checkedInputlabel = document.createElement("label");
    checkedInputlabel.className = "checked-input-label";
    checkedInputlabel.htmlFor = `checked-input-${task.id}`;

    let img = document.createElement("img");
    img.src = "images/icon-check.svg";
    checkedInputlabel.appendChild(img);
    taskLi.appendChild(checkedInputlabel);

    let text = document.createElement("p");
    text.className = "text";
    text.innerHTML = task.title;
    taskLi.appendChild(text);

    let deleteIcon = document.createElement("img");
    deleteIcon.className = "delete";
    deleteIcon.src = "images/icon-cross.svg";
    taskLi.appendChild(deleteIcon);

    taskLi.setAttribute("data-id", task.id);

    tasksDiv.appendChild(taskLi);
  });
}

function addTasksToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function leftedTasks(arrayOfTasks) {
  let count = 0;
  arrayOfTasks.forEach((task) => {
    if (!task.completed) {
      count++;
    }
  });
  document.querySelector(".lefted-tasks .num").innerHTML = count;
}

document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("checked-input-label") &&
    e.target.parentElement.hasAttribute("data-id")
  ) {
    arrayOfTasks.forEach((task) => {
      if (task.id == e.target.parentElement.dataset.id) {
        e.target.previousSibling.checked
          ? (task.completed = false)
          : (task.completed = true);
        addTasksToPage(arrayOfTasks);
        addTasksToLocalStorage(arrayOfTasks);
        leftedTasks(arrayOfTasks);
        clickActiveSpan();
      }
    });
  }
  if (e.target.className === "delete") {
    arrayOfTasks.forEach((task, index) => {
      if (task.id == e.target.parentElement.dataset.id) {
        arrayOfTasks.splice(index, 1);
        addTasksToLocalStorage(arrayOfTasks);
        leftedTasks(arrayOfTasks);
      }
    });
    e.target.parentElement.remove();
    if (tasksDiv.innerHTML === "") {
      tasksDiv.innerHTML = `<li class="no-task">No tasks available</li>`;
    }
  }
  if (e.target.classList.contains("text")) {
    e.target.parentElement.children[0].click();
  }
});

allSpanFilter.onclick = function (e) {
  addActiveInCurrentSpan(e);
  let taskLis = document.querySelectorAll(".tasks .task");
  let noTaskLi = document.querySelector(".tasks .no-task");
  noTaskLi === null ? "" : noTaskLi.remove();
  let showedLiCount = 0;
  if (taskLis.length > 0) {
    taskLis.forEach((li) => {
      li.style.display = "flex";
      showedLiCount++;
    });
  }
  if (showedLiCount == 0) {
    tasksDiv.innerHTML += `<li class="no-task">No tasks available</li>`;
  }
};

activeSpanFilter.onclick = function (e) {
  addActiveInCurrentSpan(e);
  let taskLis = document.querySelectorAll(".tasks .task");
  let noTaskLi = document.querySelector(".tasks .no-task");
  noTaskLi === null ? "" : noTaskLi.remove();
  let showedLiCount = 0;
  if (taskLis.length > 0) {
    taskLis.forEach((li) => {
      if (li.children[0].checked) {
        li.style.display = "none";
      } else {
        li.style.display = "flex";
        showedLiCount++;
      }
    });
  }
  if (showedLiCount == 0) {
    tasksDiv.innerHTML += `<li class="no-task">No tasks available</li>`;
  }
};

completedSpanFilter.onclick = function (e) {
  addActiveInCurrentSpan(e);
  let taskLis = document.querySelectorAll(".tasks .task");
  let noTaskLi = document.querySelector(".tasks .no-task");
  noTaskLi === null ? "" : noTaskLi.remove();
  let showedLiCount = 0;
  if (taskLis.length > 0) {
    taskLis.forEach((li) => {
      if (li.children[0].checked) {
        li.style.display = "flex";
        showedLiCount++;
      } else {
        li.style.display = "none";
      }
    });
  }
  if (showedLiCount == 0) {
    tasksDiv.innerHTML += `<li class="no-task">No tasks available</li>`;
  }
};

clearCompleted.onclick = function () {
  let taskLis = document.querySelectorAll(".tasks .task");
  if (taskLis.length > 0) {
    taskLis.forEach((li) => {
      if (li.children[0].checked) {
        arrayOfTasks.forEach((task, index) => {
          if (task.id == li.dataset.id) {
            arrayOfTasks.splice(index, 1);
            addTasksToLocalStorage(arrayOfTasks);
          }
        });
        li.remove();
        if (tasksDiv.innerHTML === "") {
          tasksDiv.innerHTML = `<li class="no-task">No tasks available</li>`;
        }
      }
    });
  }
};

function addActiveInCurrentSpan(e) {
  filterSpans.forEach((span) => {
    span.classList.remove("show");
  });
  e.target.classList.add("show");
}

function clickActiveSpan() {
  filterSpans.forEach((span) => {
    if (span.classList.contains("show")) {
      span.click();
    }
  });
}

if (window.localStorage.getItem("theme")) {
  if (window.localStorage.getItem("theme") === "dark") {
    themeSwitcher.click();
  }
}

if (window.localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
  if (arrayOfTasks.length > 0) {
    addTasksToPage(arrayOfTasks);
    addTasksToLocalStorage(arrayOfTasks);
    leftedTasks(arrayOfTasks);
  }
}

function dragAndDrop() {
  let lis = document.querySelectorAll(".tasks .task");
  lis.forEach((li) => {
    li.addEventListener("dragstart", () => {
      setTimeout(() => {
        li.classList.add("dragging");
      }, 0);
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });
  });
  tasksDiv.addEventListener("dragover", (e) => {
    e.preventDefault();
    let draggingItem = document.querySelector(".dragging");
    const siblings = [...tasksDiv.querySelectorAll(".task:not(.dragging)")];
    let nextSibling = siblings.find((sibling) => {
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    tasksDiv.insertBefore(draggingItem, nextSibling);
  });
  tasksDiv.addEventListener("dragenter", (e) => e.preventDefault());
}
