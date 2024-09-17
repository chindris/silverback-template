import { registerBlockType } from 'wordpress__blocks';

const { t: __ } = Drupal;

registerBlockType<{}>(`custom/horizontal-separator`, {
  title: __('Horizontal separator'),
  icon: 'minus',
  category: 'text',
  attributes: {},
  edit: () => {
    return <hr />;
  },
  save: () => {
    return null;
  },
});
