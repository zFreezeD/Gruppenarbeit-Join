function board(){
    let content = document.getElementById('content');
    content.innerHTML = '';
    content.innerHTML +=`
    <div class="boardoverview">

    <div class="toDo" id="toDo"></div>
    <div class="inProgress" id="inProgress"></div>
    <div class="testing" id="testing"></div>
    <div class="done" id="done"></div>
    
    </div>
    `;
}