// let page = 1;
let infiniteScroll;
let maxPage;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends'
})

arrowBtn.addEventListener('click', () => {
    location.hash = window.history.back();
    //history.back();
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, {passive : false})

function navigator(){

    if (infiniteScroll) {
        window.removeEventListener('scrool', getPaginasTrendingMovies, {passive : false})
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        TrendsPage()
    } else if (location.hash.startsWith('#search=')) {
        SearchPage()
    } else if(location.hash.startsWith('#movie=')){
        MoviePage()
    } else if(location.hash.startsWith('#category')){
        CategoriasPage()
    } else {
        HomePage()
    }  

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scrool', getPaginasTrendingMovies, {passive : false})
    }
}

function TrendsPage(){
    console.log('TRENDS!!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies();

    infiniteScroll = getPaginasTrendingMovies;
}

function SearchPage(){
    console.log('SEARCH!!!')
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query)

    infiniteScroll = getPaginasMoviesBySearch(query);
}
function MoviePage(){
    console.log('MOVIE!!!');
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMoviesBySearch(movieId)
    getMovieById(movieId);
}

function CategoriasPage(){
    console.log('CATEGORIES');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;
    const newName = decodeURI(categoryName);
    
    getMoviesByCategory(categoryId, newName);

    infiniteScroll = getPaginasMoviesByCategory(categoryId)
}
function HomePage(){
    console.log('HOME!!!');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive')
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');




    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}