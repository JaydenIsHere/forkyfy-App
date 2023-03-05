import icons from 'url:../../img/icons.svg'; //parcel 2 require url
export default class View {
  _data;
  _errorMessage =
    'We could not find the recipe you are looking for, Please try again';
  _message = '';

  /**
   *
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered(e.g. recipe)
   * @param {boolean } [render=true] if false,create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned for this._parentElement.insertAdjacentHTML if render = false
   * @this {Object} View instance
   * @author Jayden
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.showErrorMessage();
    this._data = data;
    const markeup = this._generateMarkup();
    if (!render) return markeup;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markeup);
  }

  //update with virtual DOM
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.showErrorMessage();
    this._data = data;
    const newMarkeup = this._generateMarkup();
    //create virtual DOM here
    const newDOM = document.createRange().createContextualFragment(newMarkeup); //convert string to virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((newEl, i) => {
      //update text
      const currentEl = currentElements[i];
      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //if bith not equal and newEl must has text then we change currentEl textContent to newEl's textCotent
        currentEl.textContent = newEl.textContent;
      }
      //update attributes
      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  /**
   *
   * @param {string} message string display error message from this._errorMessage
   */
  showErrorMessage(message = this._errorMessage) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  showMessage(message = this._message) {
    const markup = `
        <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforebegin', markup);
  }

  showSpin() {
    const markup = `
        <div class="spinner">
                 <svg>
                   <use href="${icons}#icon-loader"></use>
                 </svg>
               </div>
        `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
