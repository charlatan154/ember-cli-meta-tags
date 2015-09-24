import Ember from 'ember';

const { set, get } = Ember;

export function rendererFactory(container) {
  let renderer = container.lookup('renderer:-dom');
  let application = container.lookup('application:main');
  if (renderer && !application.autoboot) {
    let document = get(renderer, '_dom.document');
    if (document) {
      // fastboot is running
      let rendererService = container.lookup(
        'service:head-tags/fastboot-renderer'
      );
      set(rendererService, 'document', document);
      return rendererService;
    }
  }
  let component = container.lookup(
    'component:head-tags'
  );
  component.appendTo('head');
  return component;
}

export function initialize(instance) {
  const container = instance.lookup ? instance : instance.container;
  let service = container.lookup('service:head-tags');
  service.get('router').on('didTransition', function() {
    service.collectHeadTags();
  });

  // inject renderer service
  service.set('renderer', rendererFactory(container));
}

export default {
  name: 'head-tags',
  initialize: initialize
};
