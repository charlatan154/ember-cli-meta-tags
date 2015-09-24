import Ember from 'ember';

const { set, get, getProperties } = Ember;

export default Ember.Service.extend({

  headTags: Ember.computed({
    set(key, value) {
      this._clearPreviousTags();
      this._appendTagsToHead(value);
    }
  }),

  _appendTagsToHead(tagDefs) {
    const document = this.get('document');
    let elements = tagDefs.map(function(tagDef) {
      var { type, attrs } = getProperties(tagDef, 'type', 'attrs');
      if (!type) { return; }
      let element = document.createElement(type);
      Object.keys(attrs).forEach(function(key) {
        element.setAttribute(key, attrs[key]);
      });
      document.head.appendChild(element);
      return element;
    });
    set(this, 'currentTagElements', elements);
  },

  _clearPreviousTags() {
    let elements = get(this, 'currentTagElements');
    if (!elements || get(elements, 'length') === 0) { return; }
    const document = this.get('document');
    elements.forEach(function(element) {
      document.head.removeChild(element);
    });
  }

});
