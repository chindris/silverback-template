import { InnerBlocks } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { useSelect } from 'wordpress__data';

const { t: __ } = Drupal;
const MAX_BLOCKS: number = 3;

registerBlockType<{}>('custom/info-grid', {
  title: __('Info Grid'),
  icon: 'editor-insertmore',
  category: 'layout',
  attributes: {},
  edit: (props) => {
    /* eslint-disable-next-line */
    const { blockCount } = useSelect((select) => ({
      blockCount: select('core/block-editor').getBlockCount(props.clientId),
    }));

    return (
      <div className={'container-wrapper !border-stone-500'}>
        <div className={'container-label'}>{__('Info Grid')}</div>
        <InnerBlocks
          templateLock={false}
          renderAppender={() => {
            if (blockCount >= MAX_BLOCKS) {
              return null;
            } else {
              return <InnerBlocks.DefaultBlockAppender />;
            }
          }}
          allowedBlocks={['custom/info-grid-item']}
          template={[]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
