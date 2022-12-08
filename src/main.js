const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type' : 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    }, 
});

const lazyLoader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // console.log(entry)
        if (entry.isIntersecting) {
            const URL = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', URL)
        }
    })
});

function likeMovieList(){
    const item = JSON.parse(localStorage.getItem('Nombre'));
    let movie;

    if (item) {
        movie = item
    } else{
        movie = {}
    }

    return movie;
}

function likeMovie(movie){
    const likedMovies = likeMovieList();

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('Nombre', JSON.stringify(likedMovies))
}

function createMovies(movies, container, {
    lazyLoad=false, 
    clean=true,
    } = {}
    ){
    if (clean) {
        container.innerHTML = '';
    }
    
    movies.forEach(movie => {
    
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
        lazyLoad ? 'data-img' : 'src',
        'https://image.tmdb.org/t/p/w300' + movie.poster_path, )

    movieImg.addEventListener('error', () => {
        movieImg.setAttribute('src', 'https://img.freepik.com/vector-gratis/astronauta-dabbing-cartoon-vector-icon-illustration-concepto-icono-tecnologia-ciencia-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3360.jpg?w=2000')
    })
    movieImg.addEventListener('click', () => {
        location.hash = "#movie=" + movie.id;
    })

    if (lazyLoad) {
        lazyLoader.observe(movieImg)
    }

    const movieButton = document.createElement('button');
    movieButton.classList.add('movie-btn');
    if(likeMovieList()[movie.id]){
        movieButton.classList.add('movie-btn--liked')
    }
    movieButton.addEventListener('click', () => {
        movieButton.classList.toggle('movie-btn--liked');
        likeMovie(movie);
        getLikedMovies()
    } )

    movieContainer.appendChild(movieImg);
    movieContainer.append(movieButton)
    container.appendChild(movieContainer);

    })
}

function createContegories(categories, container) {
    container.innerHTML = '';
    categories.forEach(category => {
        
        const movieContainer = document.createElement('div');
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        movieContainer.classList.add('movie-container');
        const categoryTitle = document.createElement('h3');

        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })
}


async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, true);
    
}




async function getTrendingMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    maxPage = data.total_pages
    console.log(maxPage)

    createMovies(movies, genericSection, {lazyLoad: true, clean:true});
    // const btnCargarMas = document.createElement('button');
    // btnCargarMas.innerHTML = 'Cargar Más'
    // btnCargarMas.addEventListener('click', () => {
    //     btnCargarMas.style.display = 'none';
    //     getPaginasTrendingMovies();
    // })
    
    // genericSection.appendChild(btnCargarMas)
    

}

let page = 1

window.addEventListener('scroll', getPaginasTrendingMovies)

async function getPaginasTrendingMovies(){
const { scrollTop, scrollHeight, clientHeight } =  document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if(scrollIsBottom && pageIsNotMax){
        page++;
    const {data} = await api('trending/movie/day', {
        params: {
            page,
        }
    });
    const movies = data.results;
    console.log(data)

    createMovies(movies, genericSection, {lazyLoad: true, clean:false});
    }

    // const btnCargarMas = document.createElement('button');
    // btnCargarMas.innerHTML = 'Cargar Más'
    // btnCargarMas.addEventListener('click', () => {
    //     btnCargarMas.style.display = 'none';
    //     getPaginasTrendingMovies();
    // })
    // genericSection.appendChild(btnCargarMas)

}

async function getCategoriesPreview(){
    const {data} = await api('genre/movie/list');

    const categories = data.genres;
    
    createContegories(categories, categoriesPreviewList, true)
    
    
}


async function getMoviesByCategory(id){
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id, 
        },
    });

    const movies = data.results;
    maxPage = data.total_pages
    
    createMovies(movies, genericSection, true);
}

async function getPaginasMoviesByCategory(id){
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } =  document.documentElement
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
            const {data} = await api('discover/movie', {
                params: {
                    with_genres: id, 
                    page,
                },
            });
        const movies = data.results;
        console.log(data)
    
        createMovies(movies, genericSection, {lazyLoad: true, clean:false});
        }
    
        // const btnCargarMas = document.createElement('button');
        // btnCargarMas.innerHTML = 'Cargar Más'
        // btnCargarMas.addEventListener('click', () => {
        //     btnCargarMas.style.display = 'none';
        //     getPaginasTrendingMovies();
        // })
        // genericSection.appendChild(btnCargarMas)
    }
    
    }

async function getMoviesBySearch(query){
    const {data} = await api('search/movie', {
        params: {
            query, 
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)
    createMovies(movies, genericSection);
}

async function getPaginasMoviesBySearch(query){
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } =  document.documentElement
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage
    
        if(scrollIsBottom && pageIsNotMax){
            page++;
        const {data} = await api('search/movie', {
            params: {
                query,
                page,
            }
        });
        const movies = data.results;
        console.log(data)
    
        createMovies(movies, genericSection, {lazyLoad: true, clean:false});
        }
    
        // const btnCargarMas = document.createElement('button');
        // btnCargarMas.innerHTML = 'Cargar Más'
        // btnCargarMas.addEventListener('click', () => {
        //     btnCargarMas.style.display = 'none';
        //     getPaginasTrendingMovies();
        // })
        // genericSection.appendChild(btnCargarMas)
    }
    
    }

async function getMovieById(id){
    const {data: movie} = await api('movie/' + id);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

    console.log(movieImgUrl);

    headerSection.style.background = `
    linear-gradient(
        180deg,
        rgba(0,0,0,0.35) 19.27%,
        rgba(0,0,0,0) 29.17% 
    ),
    url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average; 

    createContegories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id){
    const { data } = await api(`movie/${id}/recommendations`);

    const relatedMovies = data.results;
    createMovies(relatedMovies, relatedMoviesContainer)

    relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies(){
    const likedMovies = likeMovieList()
    const moviesArray = Object.values(likedMovies)

const likedMoviesList = document.querySelector('.liked-movieList');
    createMovies(moviesArray, likedMoviesList, { lazyLoad: true, clean: true} )

    console.log(likedMovies)
}