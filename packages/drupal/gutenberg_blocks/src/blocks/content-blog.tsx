import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

// @ts-ignore
const { t: __ } = Drupal;

const style = {
  minHeight: '40px',
  margin: '0 -40px',
  padding: '0 40px',
};

registerBlockType(`custom/content-blog`, {
  title: __('Content'),
  category: 'layout',
  icon: 'media-document',
  attributes: {},
  supports: {
    inserter: false,
    align: true,
    html: false,
  },
  edit() {
    return (
      <main style={style} className="prose lg:prose-xl">
        <InnerBlocks
          templateLock={false}
          template={[['core/paragraph', {}]]}
          allowedBlocks={[
            'core/paragraph',
            'core/list',
            'core/table',
            'core/quote',
            'core/code',
            'custom/heading',
            'custom/cta',
            'custom/image-with-caption',
            'custom/mathjax',
          ]}
        />
      </main>
    );
  },

  save() {
    return <InnerBlocks.Content />;
  },
});
