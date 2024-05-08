import { InnerBlocks, RichText } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

// @ts-ignore
const { t: __ } = Drupal;
// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType('custom/teaser-item', {
  title: __('Teaser-item'),
  //parent: ['custom/teasers'],
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    title: {
      type: 'string',
    },
    text: {
      type: 'string',
    },
  },
  edit: (props) => {
    return (
      <>
        <div className="two-columns">
          <div>
            <DrupalMediaEntity
              classname={'w-full'}
              attributes={{
                ...(props.attributes as any),
                lockViewMode: true,
                viewMode: 'gutenberg_header',
                allowedTypes: ['image', 'remote_video'],
              }}
              setAttributes={props.setAttributes}
              isMediaLibraryEnabled={true}
              onError={(error) => {
                // @ts-ignore
                error = typeof error === 'string' ? error : error[2];
                dispatch('core/notices').createWarningNotice(error);
              }}
            />
          </div>

          <div>
            <div>
              <RichText
                className={'font-bold text-2xl mt-3'}
                identifier="title"
                tagName="div"
                value={props.attributes.title as string}
                allowedFormats={[]}
                // @ts-ignore
                disableLineBreaks={true}
                placeholder={__('Title')}
                keepPlaceholderOnFocus={true}
                onChange={(title) => {
                  setPlainTextAttribute(props, 'title', title);
                }}
              />
            </div>
            <InnerBlocks
              templateLock={false}
              template={[['core/paragraph', {}]]}
              allowedBlocks={[
                'custom/image',
                'core/list',
                'core/paragraph',
                'custom/cta',
              ]}
            />
          </div>
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
