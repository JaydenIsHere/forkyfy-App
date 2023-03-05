import icons from 'url:../../img/icons.svg'; //parcel 2 require url

class SearchView {
  _parentElement = document.querySelector('.search');

  generateQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInputField();
    return query;
  }

  _clearInputField() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addsubmitSearchEvent(func) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      func();
    });
  }
}

export default new SearchView();
