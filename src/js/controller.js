import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
// console.log(resultsView);
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    // bookmarksView.update(model.state.bookmarks);
    //1. loading recipe
    await model.loadRecipe(id);

    //2.rendering recipe

    recipeView.render(model.state.recipe);

    // console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery();
    if (!query) return;
    //load search results
    await model.loadSearchResults(query);
    //render results
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  if (updateTo > 0) model.updateServings(updateTo);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // recipeView
};

const controlAddBookmark = function () {
  //add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipeView.render(model.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render bookamrks view

    bookmarksView.render(model.state.bookmarks);
    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    // setTimeout(() => addRecipeView.toggleWindow(), 2500);
    addRecipeView.toggleWindow();
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
