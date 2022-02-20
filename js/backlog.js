
let allTasks = [];
let usersTask = [];
let workerArray = [];
let usersArray = [];

setURL('http://gruppe-167.developerakademie.net/');


async function init() {
    await downloadTasksFromServer();
    await downloadWorkersArrayFromServer();
    includeHTML();
    renderTasks();
    getCurrentTime();
    renderUserImages();
    setupWorkerArray();
}


async function downloadTasksFromServer() {
    await downloadFromServer();
    allTasks = await JSON.parse(backend.getItem('allTasks')) || [];
}


async function downloadWorkersArrayFromServer() {
    await downloadFromServer();
    workerArray = await JSON.parse(backend.getItem('workerArray')) || [];
}


function setupWorkerArray() {
    for (let i = 0; i < workerArray.image.length; i++) {
        let user = {
            id: i,
            img: 'img/taskProfile' + workerArray.image[i] + '.png',
            name: workerArray.name[i],
            email: workerArray.email[i]
        }
        usersArray.push(user);
    }
}


function renderTasks() {
    let tasks = document.getElementById('tasks');
    tasks.innerHTML = '';
    for (let i = allTasks.length - 1; i >= 0; i--) {
        if (allTasks[i].backlog) {
            tasks.innerHTML +=
                `<li class="backlog__list-item ${getBacklogColor(i)}">
       <div class="assigned-to">
       <div class="user-image-container">
       ${getUserImages(i)}
       </div>
           <div class="assigned-to__person">
               <p class="assigned-to__name">
                   ${getUserName(i)}
               </p>
               ${getUserEmail(i)}
           </div>
       </div>
       <div class="category">
           <p class="category__name">
           ${allTasks[i].category}
           <time>${allTasks[i].date}</time>
           </p>
       </div>
       <div class="details">
           <p class="details__description">
               ${shortenDescription(allTasks[i].description)}
           </p>
       </div>
        <div class="action-btn">
            <img onclick="editTask(${i})" class="edit-task" title="Edit task" src="img/edit.png">
            <img onclick="addTaskToBoard(${i})" class="add-task" title="Add task to the board" src="img/add.png">
        </div>
    </li>
    `;
        }
    }
}


function openAssignedTo() {
    let openUserContainer = document.querySelector('.assigned-to__user-container');
    openUserContainer.classList.toggle('d-none');
}


function getBacklogColor(index) {
    return allTasks[index].category;
}


function addUserToTask(id) {
    let userContainer = document.getElementById('assigned-user');
    if (!checkIsIdIncluded(id)) {
        usersTask.push(usersArray[id]);
        let index = usersTask.indexOf(usersArray[id]);
        userContainer.innerHTML += `<img class="form-assigned-to__img active" onclick="removeUserFromTask(${id})" src="${usersTask[index].img}">`;
    }
}


function checkIsIdIncluded(id) {
    return usersTask.some(user => user.id == usersArray[id].id);
}


function renderUserImages() {
    let userContainer = document.getElementById('user-cotainer');
    userContainer.innerHTML = '';
    for (let i = 0; i < workerArray.image.length; i++) {
        userContainer.innerHTML += createUserImgTag(workerArray.image[i], i);
    }
}


function createUserImgTag(path, key) {
    return `<img class="form-assigned-to__img" onclick="addUserToTask(${key})" src="img/taskProfile${path}.png">`;
}


function removeUserFromTask(id) {
    let index = usersTask.indexOf(usersArray[id]);
    usersTask.splice(index, 1);
    renderAssignUsers();
}


function shortenDescription(text) {
    let description = text;
    let shorten = description.substring(0, 60);
    if (text.length > 60) {
        return shorten.replace(/.$/, "...");
    } else {
        return description;
    }
}


function getUserImages(index) {
    for (let i = 0; i < allTasks[index].users.length; i++) {
        return showUserImages(index);
    }
}


function showUserImages(index) {
    let img = '';
    let count = 0;
    for (let i = 0; i < allTasks[index].users.length; i++) {
        if (count <= 1) {
            count++;
            img += `<img class="assigned-to__img" src="${allTasks[index].users[i].img}" alt="">`;
        } else {
            img += `<div class="more-images">+ ${allTasks[index].users.length - 2}</div>`;
            break;
        }
    }
    return img;
}


function getUserEmail(index) {
    let eMail = '';
    for (let i = 0; i < allTasks[index].users.length; i++) {
        return eMail = `<a class="assigned-to__mail" href="${allTasks[index].users[i].email}">${allTasks[index].users[i].email}</a>`;
    }
}


function getUserName(index) {
    for (let i = 0; i < allTasks[index].users.length; i++) {
        return allTasks[index].users[i].name;
    }
}


function renderAssignUsers() {
    let userContainer = document.getElementById('assigned-user');
    userContainer.innerHTML = '';
    for (let i = 0; i < usersTask.length; i++) {
        userContainer.innerHTML += `<img class="form-assigned-to__img active" onclick="removeUserFromTask(${usersTask[i].id})" src="${usersTask[i].img}">`;
    }
}


function addTaskToBoard(index) {
    allTasks[index].backlog = false;
    allTasks[index].board = true;
    renderTasks();
    addToBoardNotification();
    updateTasksToServer();
}


function updateTasksToServer() {
    backend.setItem('allTasks', JSON.stringify(allTasks));
}


function editTask(index) {
    openEditTask();
    getTaskTitle(index);
    getTaskDescription(index);
    getDate(index);
    getTaskCategory(index);
    getTaskUrgency(index);
    pushUserImages(index);
    renderAssignUsers();
    document.getElementById('tasks-form').setAttribute('onsubmit', `saveEditTaskToServer(${index}); event.preventDefault();`)
}


function pushUserImages(index) {
    for (let i = 0; i < allTasks[index].users.length; i++) {
        renderUsersTask(allTasks[index].users[i]);
    }
}

function renderUsersTask(object) {
    for (let i = 0; i < usersArray.length; i++) {
        if (object.id == usersArray[i].id) {
            usersTask.push(usersArray[i]);
        }
    }
}


function getTaskTitle(index) {
    let title = document.getElementById('title');
    title.value = allTasks[index].title;
}


function getTaskCategory(index) {
    let category = document.getElementById('category');
    category.value = allTasks[index].category;
}


function getTaskUrgency(index) {
    let urgency = document.getElementById('urgency');
    urgency.value = allTasks[index].urgency;
}


function getTaskDescription(index) {
    let textarea = document.getElementById('textarea');
    textarea.value = allTasks[index].description;
}

function getCurrentTime() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let today = year + "-" + month + "-" + day + "T00:00";
    document.getElementById("date-time").value = today;
}


function getDate(index) {
    let date = document.getElementById("date-time")
    date.value = allTasks[index].date;
}


function openEditTask() {
    let openOverlay = document.getElementById('overlay');
    removeDnone();
    $delay(openOverlay.classList.add('active'), 300);
}


function closeEditTask() {
    usersTask = [];
    let openOverlay = document.getElementById('overlay');
    openOverlay.classList.remove('active');
    $delay(() => { addDnone() }, 150);
}


function addDnone() {
    let openOverlay = document.getElementById('overlay');
    openOverlay.classList.add('d-none');
}


function removeDnone() {
    let openOverlay = document.getElementById('overlay');
    openOverlay.classList.remove('d-none');

}


function saveEditTaskToServer(index) {
    let form = document.getElementById("tasks-form").elements;
    allTasks[index].title = form[0].value;
    allTasks[index].category = form[1].value;
    allTasks[index].description = form[2].value;
    allTasks[index].date = form[3].value;
    allTasks[index].urgency = form[4].value;
    allTasks[index].users = usersTask;
    renderTasks();
    showEditNotification();
    backend.setItem('allTasks', JSON.stringify(allTasks));
}

function showEditNotification() {
    let edit = document.getElementById('edit-notification');
    edit.classList.remove('hide');
    $delay(() => { edit.classList.add('hide') }, 5000);
    $delay(() => { closeEditTask() }, 2000);

}


function addToBoardNotification() {
    showNotification();
    $delay(() => { hideNotification() }, 5000);
}


function showNotification() {
    let notification = document.querySelector('.notification');
    notification.classList.add('active');
}


function hideNotification() {
    let notification = document.querySelector('.notification');
    notification.classList.remove('active');
}


function $delay(argument, time) {
    return setTimeout(argument, time);
}
