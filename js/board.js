
let currentDraggedElement;
allTasks = [];

userTasks = [];

currentID = 1;


///Server Code

setURL('http://gruppe-167.developerakademie.net/');

async function downloadTasks() {
    await downloadTasksFromServer();
}

async function downloadTasksFromServer() {
    await downloadFromServer();
    allTasks = await JSON.parse(backend.getItem('allTasks')) || [];
    createObjects();
}

function uploadUserTasks() {
    backend.setItem('userTasks', JSON.stringify(userTasks));
    console.log("Uploaded UserTasks");
}

//Normal Code
function createObjects() {

    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i]['backlog'] == false) {
            for (let x = 0; x < allTasks[i]['users'].length; x++) {
                if (allTasks[i]['users'][x]['id'] == currentID && allTasks[i]['users'][x]['alreadyBoard'] == undefined) {
                    allTasks[i]['users'][x]['alreadyBoard'] = true;
                    allTasks[i]['users'][x]['whatBoard'] = "landing";

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

    createCards();
}

function createCards() {

    document.getElementById('landing-landing').innerHTML = "";
    document.getElementById('landing-inprogress').innerHTML = "";
    document.getElementById('landing-discuss').innerHTML = "";
    document.getElementById('landing-done').innerHTML = "";



    for (let i = 0; i < userTasks.length; i++) {
        if (allTasks[userTasks[i]['taskIndex']]['users'][userTasks[i]['userIndex']]['id'] == currentID) {
            landing = document.getElementById(userTasks[i]['category']);
            landing.innerHTML += 
            `<div id="index-${i}" ondragstart="startDrag(${i})" draggable="true" class="dragable-note">
            <div class="dragable-note-title">${allTasks[userTasks[i]['taskIndex']]['title']}</div>
            <div class="dragable-note-description">${allTasks[userTasks[i]['taskIndex']]['description']}</div>
            <div class="dragable-note-date">${allTasks[userTasks[i]['taskIndex']]['date']}</div>
        </div>`
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
    createCards();
}