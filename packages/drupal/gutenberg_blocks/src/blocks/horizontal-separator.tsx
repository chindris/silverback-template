import { registerBlockType } from 'wordpress__blocks';
import { compose, withState } from 'wordpress__compose';

const { t: __ } = Drupal;

// @ts-ignore
registerBlockType(`custom/horizontal-separator`, {
  title: __('Horizontal separator'),
  icon: 'minus',
  category: 'text',
  attributes: {},
  // @ts-ignore
  edit: compose(withState())(() => {
    return <hr />;
  }),
  save() {
    return null;
  },
});
