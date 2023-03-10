import icons from 'url:../../img/icons.svg'; //parcel 2 require url
import { Fraction } from 'fractional';
import View from './View';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');

  //public field

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    // window.addEventListener('load',handler)
  }

  //this generateMarkup will be call everytime we click the recipe
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data?.image}" class="recipe__img" alt="${
      this._data?.title
    }" />
          <h1 class="recipe__title">
            <span>${this._data?.title}</span>
          </h1>
        </figure>
        
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data?.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data?.servings
            }</span>
            <span class="recipe__info-text">servings</span>
        
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-update-to="${
                this._data?.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle" ></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-update-to="${
                this._data?.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
        
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#${
      this._data?.bookmarked ? 'icon-bookmark-fill' : 'icon-bookmark'
    }"></use>
            </svg>
          </button>
        </div>
        
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
        
          ${this._data?.ingredients
            .map(ing => {
              return `
             <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ing.quantity ? new Fraction(ing?.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing?.unit}</span>
                ${ing?.description}
              </div>
            </li>
             `;
            })
            .join('')}
           
          </ul>
        </div>
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data?.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data?.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
          `;
    //clean all innerHTML first before insert
  }

  //PubSub patern
  addHandleUpdateServing(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--increase-servings');
      const { updateTo } = btn.dataset;
      if (!btn) return;

      if (+updateTo > 0) handler(+updateTo); //pass the serving number to handler function
    });
  }

  addHandleBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const bookmarkBtn = e.target.closest('.btn--bookmark');
      if (!bookmarkBtn) return;
      handler();
    });
  }
}

export default new RecipeView();
