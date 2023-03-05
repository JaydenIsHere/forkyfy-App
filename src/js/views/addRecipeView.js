import icons from 'url:../../img/icons.svg'; //parcel 2 require url
import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload'); //entire form

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _message = 'Your recipe uploaded successfully';
  constructor() {
    super();
    this._addHandleShowWindow();
    this._addHandleRemoveWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandleShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandleRemoveWindow() {
    [this._btnClose, this._overlay].forEach(event =>
      event.addEventListener('click', this.toggleWindow.bind(this))
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      //each input will be array that consist key value pair. Formdata return an object
      //in eventhandler this keyword point to target element
      const data = Object.fromEntries(dataArr); //convert each input array to object
      handler(data);
    });
  }
}

export default new AddRecipeView();
