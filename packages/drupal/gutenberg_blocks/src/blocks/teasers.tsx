import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/teasers', {
  title: __('Teasers'),
  icon: 'format-image',
  category: 'layout',
  attributes: {},
  edit: () => {
    return (
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Teasers')}</div>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/teaser-item']}
          template={[['custom/teaser-item']]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
