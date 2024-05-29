import './general';
const regeneratorRuntime = require("regenerator-runtime");

const API_KEY = "?api_key=30a72465b4ea70bc5e40084e8fa0656d";
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
        this.search = '';
        this.curPage = 1;
        this.totalPages = 1;
        this.selectedIndex = 0;

        //ui elements
        this.searchInput = document.getElementById('search');
        this.searchButton = document.getElementById('searchSubmit');
        this.searchResultsBox = document.getElementById('searchResults');
        this.pageOut = document.getElementById("pageNumOut");
        this.$prevPage = document.getElementById("prevPage");
        this.$nextPage = document.getElementById("nextPage");
        
        //bind necessary functions
        this.addEventListeners = this.addEventListeners.bind(this);
        this.submitMovieSearch = this.submitMovieSearch.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.addEventListeners();
    }

    //class methods

    addEventListeners(){
        this.searchButton.onclick = this.submitMovieSearch;
        this.$prevPage.onclick = this.prevPage;
        this.$prevPage.style.cursor = "pointer";
        this.$nextPage.onclick = this.nextPage;
        this.$nextPage.style.cursor = "pointer";
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
                    <div class="col-2"><img src="${IMAGE_URL}${this.searchResults[index].poster_path}" alt="Movie Poster" style="width: 90%; height: 90%;"></div> 
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

    selectResult(index){
        this.deselectResults();

        this.selectedIndex = index;
        document.getElementById(`sr${index}`).style.backgroundColor = "yellow";
    }

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

    deselectResults(){
        for(let i = 0; i < this.searchResults.length; i++){
            document.getElementById(`sr${i}`).style.backgroundColor = 'white';
        }
    }
};

window.onload = () => { new Search }