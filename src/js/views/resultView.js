import icons from 'url:../../img/icons.svg'; //parcel 2 require url
import View from './View';
import previewView from './previewView';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found, Please try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
    //preview here loop throug all date with its generate markup then it only return string
    //join here is convert string array back to one big chunk string
  }
}
export default new ResultView();
