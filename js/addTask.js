function addtask() {

}

let isMenu = false;


function addMember() {
    if (isMenu == false) {
        document.getElementById('assign-menu').classList.remove('d-none');
        isMenu = true;
    }else{
        document.getElementById('assign-menu').classList.add('d-none');
        isMenu = false;
    }
}