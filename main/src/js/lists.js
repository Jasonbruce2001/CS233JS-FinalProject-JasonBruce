import './general';
const regeneratorRuntime = require("regenerator-runtime");
let EMPTY_MOVIE = {title: '', rating: '', comments: '', link: ''};
const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280/';

class List{
    constructor(){
        //try accessing lists from local storage
        try {
            this.lists = JSON.parse(localStorage["lists"]);
        } catch {
            //set tasks to object literal if none found
            //jagged array, arrays are object literals, with the first always being info on the list itself
            //movie objects follow
            this.lists = [];
            
            console.log("Could not load from local storage");
        }

        this.selectedIndex = -1; //negative 1 when nothing selected

        //ui elements
        this.storedLists = document.getElementById("lists");
        this.addListIcon = document.getElementById("addListIcon");
        this.curList = document.getElementById("currentList");
        this.renameInput;
        this.currentListOutput = document.getElementById("currentListOutput");

        //bind necessary functions
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addList = this.addList.bind(this);
        this.removeStoredList = this.removeStoredList.bind(this);
        this.selectList  =  this.selectList.bind(this);
        this.deselectLists = this.deselectLists.bind(this);
        this.renameList = this.renameList.bind(this);
     
        //call functions to start program
        this.addEventListeners();
        this.renderStoredLists();
    }

    addEventListeners(){
        this.addListIcon.onclick = this.addList;

        const lists = document.getElementsByName("list");

        lists.forEach((list, i) => {
            lists[i].onclick = this.selectList.bind(this, i);
        })
    }

    addList(){
        this.visualAddPress();
        
        const NEW_LIST = {listName: `List ${this.lists.length + 1}`, numMovie: 0};
        const newList = [NEW_LIST];
            
        //add new list
        this.lists.push(newList);

        //set lists to local storage
        localStorage["lists"]  = JSON.stringify(this.lists);
        console.log(JSON.parse(localStorage["lists"]));

        //re-render lists
        this.deselectLists();
        this.renderStoredLists();
        this.addEventListeners();
    }

    selectList(index){
        //event.preventDefault();

        try{
        this.deselectLists();
        this.renameInput = document.getElementById("renameInput");

        document.getElementById(`list${index}`).style.backgroundColor = "LightGray";

        let list = this.lists[index];
        this.selectedIndex = index;
        
        this.renderListContents(list);                                    

        let rename = document.getElementById("rename");
        this.renameInput = document.getElementById("renameInput");

        rename.onclick = this.renameList;
        } catch {
            console.log("No lists");
        }

    }

    renameList(){
        if(this.selectedIndex != -1){
            let list = this.lists[this.selectedIndex];
            list[0].listName = this.renameInput.value;
    
            localStorage["lists"] = JSON.stringify(this.lists);
            this.renderStoredLists();
        } else {
            console.log("selectedIndex = -1");
        }
        
    }

    deselectLists(){
        try {
            for(let i = 0; i < this.lists.length; i++){
                document.getElementById(`list${i}`).style.backgroundColor = "white";
            }
            this.selectedIndex = -1;
        } catch {
            console.log("Cant deselect");
        }
    }

    //renders html for all stored lists
    renderStoredLists(){
        let html = '';

        for(let i = 0; i < this.lists.length; i++){
            html += this.renderStoredList(i);
        }

        this.storedLists.innerHTML = html;

        for(let i = 0; i < this.lists.length; i++){
            document.getElementById(`deleteList${i}`).onclick = this.removeStoredList.bind(this, i);
            document.getElementById(`list${i}`).onclick = this.selectList.bind(this, i);
        }
    }

    //renders html for a single stored list
    renderStoredList(listNum){
        const list = this.lists[listNum];

        return `<div class="listItem list" id=list${listNum}>
                    <h4>- ${list[0].listName} <i class="bi bi-dash-square" style="float:right; margin-right: 15px;" id="deleteList${listNum}"></i></h4>
                </div>`;
    }

    renderListContents(list){
        let html = "";
        console.log(list);

        if(list.length == 1){
            html = "<div class='d-flex noResults'><h4>- No movies in current list. To add a movie, click on one in the search field and fill out the form. -</h4></div>";
        } else {
            for(let i = 1; i < list.length; i++){
                html += this.renderListContent(list, i);
            }
        }
        

        this.currentListOutput.innerHTML = html;
    }

    renderListContent(list, index){
        return `<div class="row resultItem" id="">
                    <div class="col-2"><img src="${IMAGE_URL}${list[index].path}" alt="Movie Poster" style="width: 90%; height: 90%; margin-top: 7%;"></div> 
                    <div class="col"><p><b>Title:</b> ${list[index].title} <br />
                        <b>Rating:</b> ${list[index].rating} 
                        <br /><br /><b>Comments: </b> ${list[index].comments}
                    </div>
                </div>`;
    }

    removeStoredList(index, event){
        this.deselectLists();
        event.preventDefault();
        this.visualMinusPress(index);

        if(confirm("Are you sure you want to delete this list?")){
            this.lists.splice(index, 1);
        }

        localStorage["lists"] = JSON.stringify(this.lists);
        this.renderStoredLists();
        this.deselectLists();
    }

    //helper functions
    visualAddPress(){
        //remove old class and add filled class
        addListIcon.classList.remove("bi-plus-square");
        addListIcon.classList.add("bi-plus-square-fill");

        //call setTimeout, contains arrow function for switch icon classes back to normal state, calls after 250ms 
        setTimeout(() => {addListIcon.classList.remove("bi-plus-square-fill");
                          addListIcon.classList.add("bi-plus-square");}, 250);
    }

    visualMinusPress(index){
        const target = document.getElementById(`deleteList${index}`);
        console.log(target);

        //remove old class and add filled class
        target.classList.remove("bi-dash-square");
        target.classList.add("bi-dash-square-fill");

        //call setTimeout, contains arrow function for switch icon classes back to normal state, calls after 250ms 
        setTimeout(() => {target.classList.remove("bi-dash-square-fill");
                          target.classList.add("bi-dash-square");}, 250);
    }
};

if (window.location.href.match('lists.html') != null) {
    window.onload = () => { new List; }
}
