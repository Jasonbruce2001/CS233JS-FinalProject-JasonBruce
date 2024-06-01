import './general';
const regeneratorRuntime = require("regenerator-runtime");
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGE3MjQ2NWI0ZWE3MGJjNWU0MDA4NGU4ZmEwNjU2ZCIsInN1YiI6IjY2NGZiMTEwNzZlNGZiNmUzMmVjMWE2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q1yI370IbBlgcjbJI9ZrTUiVtDqdt16sTOhhyXuFYbg'
    }
  };
const RESULTS_LIMIT = 20;
const IMAGE_URL = 'https://image.tmdb.org/t/p/w1280/';

class Home{
    constructor(){
        //public fields
        this.trendingMovies;
        this.topRatedMovies;
        this.upcomingMovies;
        
        //ui elements
        this.trendingBox = document.getElementById("newReleasesOut");
        this.filterBox = document.getElementById("filterBox");
        this.trendingButton = document.getElementById("trendingButton");
        this.topRatedButton = document.getElementById("topRatedButton");
        this.upcomingButton = document.getElementById("upcomingButton");
        this.title = document.getElementById("title");

        //bind necessary functions to class
        this.addEventHandlers = this.addEventHandlers.bind(this);
        this.loadTopRated = this.loadTopRated.bind(this);
        this.loadTrending = this.loadTrending.bind(this);
        this.loadUpcoming = this.loadUpcoming.bind(this);
        
        this.loadTrending();
        this.addEventHandlers();

    }

    addEventHandlers(){
        this.trendingButton.onclick = this.loadTrending;
        this.topRatedButton.onclick = this.loadTopRated;
        this.upcomingButton.onclick = this.loadUpcoming;
    }

    loadTrending(){
        fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
            .then(response => response.json())
            .then(response => {
                this.trendingMovies = response.results;
                console.log(this.trendingMovies);

                this.renderTrending();
            })
            .catch(err => console.error(err));
    }

    loadTopRated(){
        fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
            .then(response => response.json())
            .then(response => {
                this.topRatedMovies = response.results;
                console.log(this.topRatedMovies);

                this.renderTopRated();
            })
            .catch(err => console.error(err));
    }

    loadUpcoming(){
        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
            .then(response => response.json())
            .then(response => {
                this.upcomingMovies = response.results;
                console.log(this.upcomingMovies);

                this.renderUpcoming();
            })
            .catch(err => console.error(err));

    }

     //renders the html for a single search item given its index 
     renderTrendingItem(index){
        //build html
        return `<div class="row resultItem" id="result${index}">
                    <div class="col-2"><img src="${IMAGE_URL}${this.trendingMovies[index].poster_path}" alt="Movie Poster" style="width: 90%; height: 90%; max-height: 180px; margin-top: 7%;"></div> 
                    <div class="col-8"><p><b>Title:</b> ${this.trendingMovies[index].title} (${this.trendingMovies[index].release_date.substring(0,4)})
                    <br><b>Online Rating:</b> ${this.trendingMovies[index].vote_average} (${this.trendingMovies[index].vote_count} 
                    votes)<br><b>Language:</b> ${this.trendingMovies[index].original_language}</p><br /><b>Description:</b> ${this.trendingMovies[index].overview}</div>
                </div>`
    }

    //renders the html for an entire list of searched items
    renderTrending(){
        let html = '';

        //if results found, render search items
        if(this.trendingMovies.length > 0){
            for(let i = 0; i < this.trendingMovies.length; i++){
                html += this.renderTrendingItem(i);
            }
        } else {
            html = '<div class="d-flex justify-content-center style="">No results found</div>'
        }
        
        //set inner html to page
        this.trendingBox.innerHTML = html;
        this.title.innerHTML = "Trending Movies";

    }

    //renders the html for a single search item given its index 
    renderTopRatedItem(index){
        //build html
        return `<div class="row resultItem" id="result${index}">
                    <div class="col-2"><img src="${IMAGE_URL}${this.topRatedMovies[index].poster_path}" alt="Movie Poster" style="width: 90%; height: 90%; max-height: 180px; margin-top: 7%;"></div> 
                    <div class="col-8"><p><b>Title:</b> ${this.topRatedMovies[index].title} (${this.topRatedMovies[index].release_date.substring(0,4)})
                    <br><b>Online Rating:</b> ${this.topRatedMovies[index].vote_average} (${this.topRatedMovies[index].vote_count} 
                    votes)<br><b>Language:</b> ${this.topRatedMovies[index].original_language}</p><br /><b>Description:</b> ${this.topRatedMovies[index].overview}</div>
                </div>`
    }

    //renders the html for an entire list of searched items
    renderTopRated(){
        let html = '';

        //if results found, render search items
        if(this.topRatedMovies.length > 0){
            for(let i = 0; i < this.topRatedMovies.length; i++){
                html += this.renderTopRatedItem(i);
            }
        } else {
            html = '<div class="d-flex justify-content-center style="">No results found</div>'
        }
        
        //set inner html to page
        this.trendingBox.innerHTML = html;
        this.title.innerHTML = "Top Rated Movies";
    }

    //renders the html for a single search item given its index 
    renderUpcomingItem(index){
        //build html
        return `<div class="row resultItem" id="result${index}">
                    <div class="col-2"><img src="${IMAGE_URL}${this.upcomingMovies[index].poster_path}" alt="Movie Poster" style="width: 90%; height: 90%; max-height: 180px; margin-top: 7%;"></div> 
                    <div class="col-8"><p><b>Title:</b> ${this.upcomingMovies[index].title} (${this.upcomingMovies[index].release_date.substring(0,4)})
                    <br><b>Online Rating:</b> ${this.upcomingMovies[index].vote_average} (${this.upcomingMovies[index].vote_count} 
                    votes)<br><b>Language:</b> ${this.upcomingMovies[index].original_language}</p><br /><b>Description:</b> ${this.upcomingMovies[index].overview}</div>
                </div>`
    }

    //renders the html for an entire list of searched items
    renderUpcoming(){
        let html = '';

        //if results found, render search items
        if(this.upcomingMovies.length > 0){
            for(let i = 0; i < this.upcomingMovies.length; i++){
                html += this.renderUpcomingItem(i);
            }
        } else {
            html = '<div class="d-flex justify-content-center style="">No results found</div>'
        }
        
        //set inner html to page
        this.trendingBox.innerHTML = html;
        this.title.innerHTML = "Upcoming Movies";
    }
};

if (window.location.href.match('index.html') != null) {
    window.onload = () => { new Home }
}