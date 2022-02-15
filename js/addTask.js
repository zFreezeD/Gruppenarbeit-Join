function addtask() {

}

let isMenu = false;

let allTasks = [];

let errorNumber = 0;

let workerArray =
{
    image: [1, 3, 2, 1, 4, 2],
    name: ["Thorsten", "Lena", "Anton", "Mehmet", "Kim", "Panto"],
    email: ["thorsten@mail.com", "lena@mail.com", "anton@mail.com", "mehmet@mail.com", "kim@mail.com", "panto@mail.com"]
}

let assignedWorkers = [];

let currentCreateImg = 1;


///Server Code

setURL('http://gruppe-167.developerakademie.net/');

async function downloadTasks() {
    await downloadTasksFromServer();
}

async function downloadTasksFromServer() {
    await downloadFromServer();
    allTasks = await JSON.parse(backend.getItem('allTasks')) || [];
}

function allTaskSaveAllTasks() {
    backend.setItem('allTasks', JSON.stringify(allTasks));
    sendToInfoBubble("Upload complete!");
}

//Normal Code

function addMember() {
    if (isMenu == false) {
        document.getElementById('assign-menu').classList.remove('d-none');
        isMenu = true;
    } else {
        document.getElementById('assign-menu').classList.add('d-none');
        isMenu = false;
    }
}

function createMember() {

    let landing = document.getElementById('member-landing');

    landing.innerHTML = "";

    for (let i = 0; i < workerArray['name'].length; i++) {
        let newImage = workerArray['image'][i];
        let newName = workerArray['name'][i];
        let newMail = workerArray['email'][i];

        landing.innerHTML += `
        <div onclick="assignTask(${i}, ${newImage})" id="member-${i}" class="assign-menu-object">
                            <img id="member-image-${i}" src="img/taskProfile${newImage}.png">
                            <div class="assign-menu-object-information">
                                <p id="member-name-${i}">${newName}</p>
                                <p id="member-email-${i}">${newMail}</p>
                            </div>
                        </div> `
    }

    landing.innerHTML +=
        `<div onclick="showInstantiate()" id="member-create" class="assign-menu-object">
        <div class="assign-menu-create">
            <p>+</p>
        </div>
    </div> `;
}

function assignTask(id, imageInt) {
    let landing = document.getElementById('assign-landing');
    if (!assignedWorkers.includes(id)) {
        assignedWorkers.push(id);
        landing.innerHTML += `
        <img onclick="removeMember(${id})" id="assigned-member-${id}" src="img/taskProfile${imageInt}.png">`;
    } else {
        sendToInfoBubble("Mitarbeiter bereits ausgewählt");
    }
}

function removeMember(id) {
    let removeIndex = assignedWorkers.indexOf(id);
    assignedWorkers.splice(removeIndex, 1);
    document.getElementById(`assigned-member-${id}`).remove();
}

function changeCreateProfileImage() {
    currentCreateImg++;

    if (currentCreateImg >= 5)
        currentCreateImg = 1;

    document.getElementById('create-member-image').src = `img/taskProfile${currentCreateImg}.png`;
}

function instantiateMember() {
    let nameInput = document.getElementById('create-member-name');
    let mailInput = document.getElementById('create-member-email');

    let createName = nameInput.value;
    let createMail = mailInput.value;

    if (createName.length > 3 && createMail.length > 5) {
        workerArray['image'].push(currentCreateImg);
        workerArray['name'].push(createName);
        workerArray['email'].push(createMail);

        nameInput.style.borderColor = "yellowgreen";
        mailInput.style.borderColor = "yellowgreen";

        nameInput.value = "";
        mailInput.value = "";

        closeInstantiate();
        createMember();
    } else {
        sendToInfoBubble("Fehelende Informationen!");
        nameInput.style.borderColor = "red";
        mailInput.style.borderColor = "red";
    }
}

function showInstantiate() {
    document.getElementById('create-member-menu').classList.remove('d-none');
}

function closeInstantiate() {
    document.getElementById('create-member-menu').classList.add('d-none');
}

function sendTask() {
    let title = document.getElementById('title-input');
    let date = document.getElementById('date-input');
    let category = document.getElementById('category-input');
    let urgency = document.getElementById('urgency-input');
    let description = document.getElementById('textarea-input');

    if (checkFilledOut(title, date, category, urgency, description)) {
        sendToInfoBubble("Wird hochgeladen...");

        let users = [];
        for (let i = 0; i < assignedWorkers.length; i++) {
            users.push({
                'email': workerArray['email'][assignedWorkers[i]],
                'id': assignedWorkers[i],
                'img': `img/taskProfile${workerArray['image'][assignedWorkers[i]]}.png`,
                'name': workerArray['name'][assignedWorkers[i]]
            }
            )
        }
        allTasks.push(
            {
                'backlog': true,
                'board': false,
                'category': category.value,
                'date': date.value,
                'description': description.value,
                'urgency': urgency.value,
                users
            }
        )
        allTaskSaveAllTasks();
        clearAll();
    } else {
        sendToInfoBubble("Etwas hat nicht Funktioniert!");
    }
}

function clearAll(){
    assignedWorkers = [];
    document.getElementById('title-input').value = "";
    document.getElementById('date-input').value = "";
    document.getElementById('category-input').value = "Sale";
    document.getElementById('urgency-input').value = "High";
    document.getElementById('textarea-input').value = "";
    document.getElementById('assign-landing').innerHTML = "";


}

function checkFilledOut(title, date, category, urgency, description) {

    if (title.value.length > 3) {
        if (date.value != undefined && date.value.length > 1) {
            if (description.value.length > 3) {
                if (assignedWorkers.length > 0) {
                    return true;
                } else {
                    sendToInfoBubble("Kein Mitarbeiter ausgewählt!");
                    return false;
                }

            } else {
                sendToInfoBubble("Beschreibung fehlt!");
                return false;
            }
        } else {
            sendToInfoBubble("Datum fehlt!");
            return false;
        }
    } else {
        sendToInfoBubble("Titel fehlt!")
        return false;
    }




}

function sendToInfoBubble(string) {

    errorNumber++;
    console.log(string);
    let newObject = document.getElementById('info-bubble-landing').innerHTML +=
        `<div id="info-object-${errorNumber}" class="info-bubble-object">
    <p>${string}</p>
</div>`
    let objectID = errorNumber;
    setTimeout(() => {
        document.getElementById(`info-object-${objectID}`).remove();
    }, 5000);
}




//Test Area

function testUrgency() {
    let category = document.getElementById('category-input');
    let urgency = document.getElementById('urgency-input');
    console.log('Category:', category.value);
    console.log('Urgency:', urgency.value);
}

function Test() {
    allTasks.push(
        {
            'backlog': true,
            'board': false,
            'category': 'testCategory',
            'date': '01-01-2022',
            'description': 'test description',
            'urgency': 'testUrgency',
            users: [{
                'email': 'test@mail.com',
                'id': '0',
                'img': 'img/taskProfile1.png',
                'name': 'test'
            }]
        }
    )

    allTaskSaveAllTasks();
}

function TestRemoveTasksFromServer() {
    allTasks = [];
    allTaskSaveAllTasks();
}