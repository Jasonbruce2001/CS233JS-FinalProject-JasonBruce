import './general';
const regeneratorRuntime = require("regenerator-runtime");

class List{
    constructor(){
        //jagged array
        this.lists = [
            [{title: 'movie1', rating: 10.0, comments: 'good movie'},
            {title: 'movie2', rating: 1.0, comments: 'bad movie'},]
            ];
        this.numLists;

        this.addListIcon = document.getElementById("addListIcon");

        this.addEventListeners();
        this.addList = this.addList.bind(this);
    }

    addEventListeners(){
        this.addListIcon.onclick = addList;
    }

    addList(){
        console.log("added");
    }
};

if (window.location.href.match('lists.html') != null) {
    window.onload = () => { new List }
}