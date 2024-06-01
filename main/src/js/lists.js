import './general';
const regeneratorRuntime = require("regenerator-runtime");
const EMPTY_MOVIE = {title: '', rating: '', comments: ''};

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
        //public class fields
        this.numLists = this.lists.length;
        this.selectedList = 0;

        //ui elements
        this.storedLists = document.getElementById("lists");
        this.addListIcon = document.getElementById("addListIcon");
        this.curList = document.getElementById("currentList");

        //bind necessary functions
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addList = this.addList.bind(this);
        this.removeStoredList = this.removeStoredList.bind(this);
     
        this.addEventListeners();
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
        const newList = [NEW_LIST, EMPTY_MOVIE];
            
        //add new list
        this.lists.push(newList);

        //re-render lists
        this.renderStoredLists();
        this.addEventListeners();
    }

    selectList(index, event){
        event.preventDefault();

        this.deselectLists();
        document.getElementById(`list${index}`).style.backgroundColor = "LightGray";
       
        let list = this.lists[index];

        this.curList.innerHTML = `<div class="d-flex">
                                    <input type="text" placeholder="${list[0].listName}" class="renameInput"> <button type="button" id="rename" class="rename">Rename</button>
                                </div>`;
    }

    deselectLists(){
        for(let i = 0; i < this.lists.length; i++){
            document.getElementById(`list${i}`).style.backgroundColor = "white";
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

    removeStoredList(index, event){
        event.preventDefault();
        this.visualMinusPress(index);

        if(confirm("Are you sure you want to delete this list?")){
            this.lists.splice(index, 1);
        }

        this.renderStoredLists();
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
