import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

const { t: __ } = Drupal;

registerBlockType<{}>('custom/image-teasers', {
  title: __('Image Teasers'),
  icon: 'format-image',
  category: 'layout',
  attributes: {},
  edit: () => {
    return (
      <div className={'container-wrapper !border-stone-500'}>
        <div className={'container-label'}>{__('Image Teasers')}</div>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/image-teaser']}
          template={[['custom/image-teaser']]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
