import * as modal from './modal'; //access all states from modal
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import bookmarkView from './views/bookmarkView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { CLOSE_FORM_SEC } from './config';

if (module.hot) {
  //remain state
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
///////////////////////////////////////

//button click submit event - callback get input value and return that valaue

const controlSearchResults = async function () {
  try {
    //get query

    const query = searchView.generateQuery();
    if (!query) return;
    resultView.showSpin();
    bookmarkView.update(modal.state.bookmarks);
    //Send HTTP request base on query
    await modal.loadSearch(query); //loadSearch function is async function so we need to await

    //render serch results
    resultView.render(modal.getSearchResultsPage());
    //generate initial pagination button
    paginationView.render(modal.state.search);
  } catch (e) {
    resultView.showErrorMessage(`Error! ${e}`);
    console.error(e);
  }
};

const controlRecipe = async function () {
  try {
    let hashUrl = window.location.hash.slice(1);
    if (!hashUrl) return;
    //showSpin is part of view function
    recipeView.showSpin();
    //update result view to mark selected result
    resultView.update(modal.getSearchResultsPage());

    //render recipe
    await modal.loadRecipe(hashUrl); //loadRecipe is an async function
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.showErrorMessage();
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  //render paginated results
  resultView.render(modal.getSearchResultsPage(gotoPage));
  //refresh the pagination
  paginationView.render(modal.state.search);
};

const controlServing = function (newServing) {
  //update the recipe serving
  modal.updateServing(newServing);

  //re-render the recipe view
  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
  //update method from View parent class
};

const controlBookmark = function () {
  //add or remove book mark
  if (!modal.state.recipe.bookmarked) {
    //if bookmarked is false the add
    modal.addBookmark(modal.state.recipe);
  } else {
    //if bookmarked is true the remove
    modal.removeBookmark(modal.state.recipe.id);
  }
  //update recipeView
  recipeView.update(modal.state.recipe);
  //render bookmark
  bookmarkView.render(modal.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarkView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.showSpin();
    //post request function
    await modal.uploadRecipe(newRecipe);
    //render customRecipe on recipeView
    recipeView.render(modal.state.recipe);
    //render customRecipe on bookmarkView
    console.log(modal.state.recipe);
    bookmarkView.render(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.key}`);

    //display success message
    addRecipeView.showMessage();

    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
      window.location.reload();
      // location.reload();
    }, CLOSE_FORM_SEC);
  } catch (e) {
    console.error(e);
    addRecipeView.showErrorMessage(e.message);
  }

  //upload to API
};

const init = function () {
  //publisher
  bookmarkView.addHadndleRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addsubmitSearchEvent(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandleUpdateServing(controlServing);
  recipeView.addHandleBookmark(controlBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // bookmarkView.addHandlePreview(controlBookmarkPreview);
};

init();
