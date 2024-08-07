import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

const { t: __ } = Drupal;

registerBlockType('custom/accordion', {
  title: __('Accordion'),
  icon: 'menu',
  category: 'layout',
  attributes: {},
  edit: () => {
    return (
      <div className={'container-wrapper !border-stone-500'}>
        <div className={'container-label'}>{__('Accordion')}</div>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/accordion-item-text']}
          template={[['custom/accordion-item-text']]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
