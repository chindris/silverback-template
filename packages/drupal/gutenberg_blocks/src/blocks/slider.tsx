import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/slider', {
  title: __('Slider'),
  icon: 'slides',
  category: 'layout',
  attributes: {},
  edit: () => {
    return (
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Slider')}</div>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/slider-item']}
          template={[['custom/slider-item']]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
