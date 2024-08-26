import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

const { t: __ } = Drupal;

const style = {
  minHeight: '40px',
  margin: '0 -40px',
  padding: '0 40px',
};

registerBlockType<{}>(`custom/content`, {
  title: __('Content'),
  category: 'layout',
  icon: 'media-document',
  attributes: {},
  supports: {
    inserter: false,
    align: true,
    html: false,
  },
  edit: () => {
    return (
      <main style={style} className="prose lg:prose-xl">
        <InnerBlocks templateLock={false} template={[['core/paragraph', {}]]} />
      </main>
    );
  },

  save: () => {
    return <InnerBlocks.Content />;
  },
});
