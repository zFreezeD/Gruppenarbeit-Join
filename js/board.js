
let currentDraggedElement;
allTasks = [];

userTasks = [];

workerArray = [];

currentID = 1;


///Server Code

setURL('http://gruppe-167.developerakademie.net/');

async function downloadTasks() {
    await downloadAll();
    createMember();
}

async function downloadAll() {
    await downloadTasksFromServer();
    await downloadUserTasksFromServer();
    await downloadWorkerArrayFromServer();
}

async function downloadTasksFromServer() {
    await downloadFromServer();
    allTasks = await JSON.parse(backend.getItem('allTasks')) || [];
    console.log("Downloaded allTasks");
}

async function downloadUserTasksFromServer() {
    await downloadFromServer();
    userTasks = await JSON.parse(backend.getItem('userTasks')) || [];
    console.log("Downloaded userTasks");
}

async function downloadWorkerArrayFromServer() {
    await downloadFromServer();
    workerArray = await JSON.parse(backend.getItem('workerArray')) || [];
    console.log("Downloaded workerArray");
}

function uploadUserTasks() {
    backend.setItem('userTasks', JSON.stringify(userTasks));
    console.log("Uploaded UserTasks");
}

function uploadAllTasks() {
    backend.setItem('allTasks', JSON.stringify(allTasks));
    console.log("Uploaded AllTasks");
}

//Normal Code


function createMember() {
    let memberSelect = document.getElementById('member-select');
    memberSelect.innerHTML = '';
    console.log("TTT", workerArray, memberSelect, workerArray.length);

    for (let i = 0; i < workerArray['name'].length; i++) {
        memberSelect.innerHTML += `<option value="${i}">${workerArray['name'][i]}</option>`;
    }

    changeUser();
}


function createObjects() {

    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i]['backlog'] == false) {
            for (let x = 0; x < allTasks[i]['users'].length; x++) {
                if (allTasks[i]['users'][x]['id'] == currentID && allTasks[i]['users'][x]['alreadyBoard'] == undefined) {
                    allTasks[i]['users'][x]['alreadyBoard'] = true;
                    allTasks[i]['users'][x]['whatBoard'] = "landing";
                    console.log("added:", allTasks[i]['users'][x]);
                    userTasks.push(
                        {
                            'taskIndex': i,
                            'userIndex': x,
                            'category': 'landing-landing'
                        }
                    )
                }
            }
        }
    }
    uploadAllTasks();
    createCards();
}

function createCards() {

    document.getElementById('landing-landing').innerHTML = "";
    document.getElementById('landing-inprogress').innerHTML = "";
    document.getElementById('landing-discuss').innerHTML = "";
    document.getElementById('landing-done').innerHTML = "";



    for (let i = 0; i < userTasks.length; i++) {
        if (allTasks.length > 0) {
            if (allTasks[userTasks[i]['taskIndex']]['users'][userTasks[i]['userIndex']]['id'] == currentID) {
                landing = document.getElementById(userTasks[i]['category']);
                console.log("Test", allTasks[userTasks[i]['taskIndex']]['urgency'])

                let colorClass;
                let textColor;

                if (allTasks[userTasks[i]['taskIndex']]['urgency'] == "High") {
                    colorClass = "border-color-red";
                    textColor = "color-red";
                }
                else if (allTasks[userTasks[i]['taskIndex']]['urgency'] == "Mid"){
                    colorClass = "border-color-yellow";
                    textColor = "color-yellow";
                }
                else{
                    colorClass = "border-color-green";
                    textColor = "color-green";
                }

                landing.innerHTML +=
                    `<div id="index-${i}" ondragstart="startDrag(${i})" draggable="true" class="dragable-note ${colorClass}">
            <div class="dragable-note-title">${allTasks[userTasks[i]['taskIndex']]['title']}</div>
            <div class="dragable-note-description">${allTasks[userTasks[i]['taskIndex']]['description']}</div>
            <div class="dragable-note-date ${textColor}">${allTasks[userTasks[i]['taskIndex']]['date']}</div>
        </div>`
            }
        }
    }
}



function startDrag(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTo(category) {
    userTasks[currentDraggedElement]['category'] = category;
    uploadUserTasks();
    createCards();
}


function changeUser() {
    currentID = document.getElementById('member-select').value;

    document.getElementById('member-name').innerHTML = workerArray['name'][currentID];
    document.getElementById('member-email').innerHTML = workerArray['email'][currentID];
    document.getElementById('member-image').src = `img/taskProfile${workerArray['image'][currentID]}.png`;
    document.getElementById('header').innerHTML = `Board of ${workerArray['name'][currentID]}`
    createObjects();
}