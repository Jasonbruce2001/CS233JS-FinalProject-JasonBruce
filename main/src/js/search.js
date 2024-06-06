import './general';
const regeneratorRuntime = require("regenerator-runtime");

//const API_KEY = "?api_key=30a72465b4ea70bc5e40084e8fa0656d";
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGE3MjQ2NWI0ZWE3MGJjNWU0MDA4NGU4ZmEwNjU2ZCIsInN1YiI6IjY2NGZiMTEwNzZlNGZiNmUzMmVjMWE2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q1yI370IbBlgcjbJI9ZrTUiVtDqdt16sTOhhyXuFYbg'
    }
  };
const RESULTS_LIMIT = 20;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280/';

class Search{
    //class constructor
    constructor(){
        //instance variables
        this.searchResults = [];
        this.listNames = [];
        this.search = '';
        this.curPage = 1;
        this.totalPages = 1;
        this.selectedIndex = 0;
        this.formHidden = true;

        //ui elements
        this.searchInput = document.getElementById('search');
        this.searchButton = document.getElementById('searchSubmit');
        this.searchResultsBox = document.getElementById('searchResults');
        this.pageOut = document.getElementById("pageNumOut");
        this.$prevPage = document.getElementById("prevPage");
        this.$nextPage = document.getElementById("nextPage");
        this.movieForm = document.getElementById("addMovieForm");
        this.selectedInfo = document.getElementById("selectedMovieInfo");
        this.selectList = document.getElementById("selectList");
        this.saveButton = document.getElementById("save");
        this.formRating = document.getElementById("rating");
        this.formComments = document.getElementById("comments");
        
        //bind necessary functions
        this.addEventListeners = this.addEventListeners.bind(this);
        this.submitMovieSearch = this.submitMovieSearch.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.saveMovie = this.addMovie.bind(this);
        
        this.addEventListeners();
        this.getListsFromStorage();
    }

    //class methods
    //method to add most event listeners to the page, some are added as elements are generated
    addEventListeners(){
        this.searchButton.onclick = this.submitMovieSearch;
        this.$prevPage.onclick = this.prevPage;
        this.$prevPage.style.cursor = "pointer";
        this.$nextPage.onclick = this.nextPage;
        this.$nextPage.style.cursor = "pointer";
        this.saveButton.style.cursor = "pointer";
        this.saveButton.onclick = this.saveMovie;
    }

    //method is called when search button is pressed, takes user input on page
    //and calls necessary functions to render list to the page
    submitMovieSearch(){
        //get search input form page
        this.search = this.searchInput.value;
        console.log(this.search);

        //make api call
        fetch(`https://api.themoviedb.org/3/search/movie?query=${this.search}&language=english&page=1`, options)
        .then(response => response.json())              //parse response as json
        .then(response => {
            console.log(response);
            this.searchResults = response.results;      //save results as array of object literals
            this.totalPages = response.total_pages;     //save total page
            this.curPage = 1;                           //make sure curPages is 1 if not first search
            this.pageOut.innerHTML = this.curPage;

            this.renderSearchList();
        })
        .catch(err => console.error(err));

        //reset search field
        this.searchInput.value = '';
    }

    //renders the html for a single search item given its index 
    renderSearchItem(index){
        //build html
        return `<div class="row resultItem" id="sr${index}">
                    <div class="col-2"><img src="${IMAGE_URL}${this.searchResults[index].poster_path}" alt="Movie Poster" style="width: 90%; height: 90%; margin-top: 7%;"></div> 
                    <div class="col-8"><p><b>Title:</b> ${this.searchResults[index].title} (${this.searchResults[index].release_date.substring(0,4)})
                    <br><b>Online Rating:</b> ${this.searchResults[index].vote_average} (${this.searchResults[index].vote_count} 
                    votes)<br><b>Language:</b> ${this.searchResults[index].original_language}</p></div>
                </div>`
    }

    //renders the html for an entire list of searched items
    renderSearchList(){
        let html = '';

        //if results found, render search items
        if(this.searchResults.length > 0){
            for(let i = 0; i < this.searchResults.length; i++){
                html += this.renderSearchItem(i);
            }
        } else {
            html = '<div class="d-flex justify-content-center style="">No results found</div>'
        }
        
        //set inner html to page
        this.searchResultsBox.innerHTML = html;

        //add event handlers
        for(let i = 0; i < this.searchResults.length; i++){
            document.getElementById(`sr${i}`).onclick = this.selectResult.bind(this, i);
        }
    }

    //selects a reselt by highlighting it in yellow
    //also calls showForm and renderSelectedInfo to generate a form for the desired movie
    selectResult(index){
        //call helper functions
        this.deselectResults();
        this.showForm();
        this.renderSelectedInfo(index);

        //update stored index
        this.selectedIndex = index;
        //set style of selected movie
        document.getElementById(`sr${index}`).style.backgroundColor = "yellow";
    }

    //cycles to  the next page of results
    nextPage(){
        //if curPage number is less than the max number of pages
        if(this.curPage < this.totalPages){
            this.curPage++; //increment curPage
            this.pageOut.innerHTML = this.curPage;

             //make api call
            fetch(`https://api.themoviedb.org/3/search/movie?query=${this.search}&language=english&page=${this.curPage}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.searchResults = response.results;

                this.renderSearchList();
            })
            .catch(err => console.error(err));
        }
    }

    //cycles to the previous page of  results
    prevPage(){
        //if curPage is greater than 1 (first page)
        if(this.curPage > 1){
            this.curPage--; //decrement curPage
            this.pageOut.innerHTML = this.curPage;

             //make api call
            fetch(`https://api.themoviedb.org/3/search/movie?query=${this.search}&language=english&page=${this.curPage}`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.searchResults = response.results;

                this.renderSearchList();
            })
            .catch(err => console.error(err));
        }
    }

    //helper function to make all search results white again
    deselectResults(){
        for(let i = 0; i < this.searchResults.length; i++){
            document.getElementById(`sr${i}`).style.backgroundColor = 'white';
        }
    }

    //renders html for the selected movie and  forms
    renderSelectedInfo(index){
        let movie = this.searchResults[index];
        const html = `<div class="row">
                        <div class="col-5"><img src="${IMAGE_URL}${movie.poster_path}" alt="Movie Poster" style="width: 80%; height: 80%; margin-top: 7%;"></div> 
                        <div class="col-7" style="margin-top: 7%;"><p><b>Title:</b> ${movie.title} (${movie.release_date.substring(0,4)})
                        <br><b>Online Rating:</b> ${movie.vote_average} (${movie.vote_count}) 
                        votes)<br><b>Language:</b> ${movie.original_language}</p><br /><b>Description:</b> ${movie.overview}</div>
                      </div>`;
        this.selectedInfo.innerHTML = html;

        //clear old children from select
        let child = this.selectList.lastElementChild;
        while (child) {
            this.selectList.removeChild(child);
            child = this.selectList.lastElementChild;
        }

        //add list names to the select bar
        for(let i = 0; i < this.listNames.length;  i++){
            //create option element for  each list
            let opt = document.createElement('option');
            opt.value = this.listNames[i];
            opt.innerHTML = this.listNames[i];

            //append element to dropdown
            this.selectList.appendChild(opt);
        }
    }

    //retrieves the users created lists from local storage
    getListsFromStorage(){
        try{
            let lists = JSON.parse(localStorage["lists"]);
                
            for(let i = 0; i < lists.length; i++){
                let list  = lists[i];
                this.listNames.push(list[0].listName);
            }

            console.log(this.listNames);
        } catch {
            console.log("lists not found");
        }
    }

    //helper function to clear movie form flag
    showForm(){
        this.movieForm.hidden = false;
    }

    //helper function to add movie form flag
    hideform(){
        this.movieForm.hidden = true;
    }

    //method to add the selected movie to the selected list
    //called when save button is clicked
    addMovie(){
        //retrieve lists from localStorage
        let lists =  JSON.parse(localStorage["lists"]);
        
        //initialize local variables for movie and list
        let movie = this.searchResults[this.selectedIndex];
        let list = lists[this.selectList.selectedIndex];

        //use form fields to push new object literal to list
        list.push({title: movie.title, rating: this.formRating.value, comments: this.formComments.value, path: movie.poster_path})

        //clear form fields
        this.formRating.value = "";
        this.formComments.value = "";
        //save lists to localStorage
        localStorage["lists"] = JSON.stringify(lists);
    }
};

if (window.location.href.match('search.html') != null) {
    window.onload = () => { new Search }
}