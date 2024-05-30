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
            this.lists = [
                [{listName: 'Example List', numMovies: 2},
                {title: 'movie1', rating: 10.0, comments: 'good movie'},
                {title: 'movie2', rating: 1.0, comments: 'bad movie'},]
                ];
            
            console.log("Could not load from local storage");
        }
        //public class fields
        this.numLists = this.lists.length;

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

        for(let i = 0; i < this.lists.length; i++){
            document.getElementById(`list${i}`).onclick = this.selectStoredList;
            
        }

    }

    addList(){
        this.visualAddPress();
        
        const NEW_LIST = {listName: `List ${this.lists.length}`, numMovie: 0};
        const newList = [NEW_LIST, EMPTY_MOVIE];
                         
        this.lists.push(newList);

        console.log(this.lists);
        console.log(this.lists[2]);

        this.renderStoredLists();
        this.addEventListeners();
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
        }
    }

    //renders html for a single stored list
    renderStoredList(listNum){
        const list = this.lists[listNum];

        return `<div class="listItem" id=list${listNum}>
                    <h4>- ${list[0].listName} <i class="bi bi-dash-square" style="float:right; margin-right: 15px;" id="deleteList${listNum}"></i></h4>
                </div>`;
    }

    renderListItem(list, index){
        
    }

    selectStoredList(){
        console.log(this.id);
    }

    removeStoredList(index){
        //this.visualMinusPress();

        if(confirm("Are you sure you want to delete this list?")){

        }
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
