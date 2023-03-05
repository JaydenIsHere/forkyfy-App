import icons from 'url:../../img/icons.svg'; //parcel 2 require url
import View from './View';
import previewView from './previewView';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHadndleRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); //join here is convert array back to string
  }
}

export default new BookmarkView();
