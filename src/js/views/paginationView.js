import icons from 'url:../../img/icons.svg'; //parcel 2 require url
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    //when search a new recipe we want to start from first page so we have to update the button view as well!!
    const currentPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const nextBtn = `<button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    const prevBtn = `<button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
    </button>`;

    //all results(92) / resultsPerPage(10)

    //-when we at the first page we have next button but no previous button
    if (currentPage === 1 && numPage > 1) {
      return nextBtn;
    }
    //-when we are at middle page we have both next and previous button
    if (currentPage < numPage) {
      return prevBtn + nextBtn;
    }
    //-when we are at last page we only have previous page
    if (currentPage === numPage && currentPage > 1) {
      return prevBtn;
    }
    //-When result is less than 10 there’s no button
    return '';
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      const gotoPage = Number(btn.dataset.goto);
      console.log(gotoPage);
      if (!btn) return;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
