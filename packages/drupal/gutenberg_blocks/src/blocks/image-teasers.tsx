import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/image-teasers', {
  title: __('Image Teasers'),
  icon: 'format-image',
  category: 'layout',
  attributes: {},
  edit: () => {
    return (
      <>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/image-teaser']}
          template={[['custom/image-teaser']]}
        />
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
