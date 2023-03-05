import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '', //store query in state for future report use
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

//function that convert property name to what we want
const createRecipeObject = function (data) {
  let { recipe } = data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (hashUrl) {
  try {
    const pizzas = await AJAX(`${API_URL}/${hashUrl}?key=${API_KEY}`);
    state.recipe = createRecipeObject(pizzas.data);
    if (state.bookmarks.some(bookmark => bookmark.id === hashUrl)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    const res = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const result = res.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.results = result; //API state
    state.search.query = query; //API state
    state.search.page = 1; //reset pagination to default
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Pagination
export const getSearchResultsPage = function (page = state.search.page) {
  //set default
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //page 1 = 0 | page 2 = 10
  const end = page * state.search.resultsPerPage; //page 1 = 10 | page 2 = 20
  return state.search.results.slice(start, end);
};

//update serving
export const updateServing = function (newServing) {
  //update quantity
  const serving = state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / serving;
    state.recipe.servings = newServing; //change recipe.servings dynamically based on newServing
  });
};

const persistBookmark = function () {
  try {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
  } catch (e) {
    throw new Error('can not store data in localStorage');
  }
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const removeBookmark = function (id) {
  const newBookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
  state.bookmarks = newBookmarks;
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const displayPersistBookmark = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmarks = JSON.parse(storage); //replace state bookmark with localstorage
};

displayPersistBookmark();

//development only
const cleatBookmark = function () {
  localStorage.clear('bookmark');
};
// clearBookmark();

export const uploadRecipe = async function (newRecipe) {
  //loop throuh that array
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].map(el => el.trim()); //convert to array
        if (ingArr.length !== 3)
          //must fill up three values quantity, unit, descripttion
          throw new Error('Wrong ingredient format, please use correct format');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //create real object to be upload
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      ingredients,
    };
    const customRecipe = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(customRecipe.data); //update recipe
    addBookmark(state.recipe);

    //convert property name with formatting function
  } catch (e) {
    throw e;
  }
};
