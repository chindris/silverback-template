import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

const { t: __ } = Drupal;
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType('custom/image-teaser', {
  title: __('Image Teaser'),
  parent: ['custom/image-teasers'],
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    title: {
      type: 'string',
    },
    ctaUrl: {
      type: 'string',
    },
    ctaText: {
      type: 'string',
    },
  },
  edit: (props) => {
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('CTA Link')}>
            <LinkControl
              placeholder={__('Link')}
              value={{
                url: props.attributes.ctaUrl,
              }}
              settings={{}}
              onChange={(link: { url: string; opensInNewTab: boolean }) => {
                props.setAttributes({
                  ctaUrl: link.url,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div>
          <div>
            <DrupalMediaEntity
              classname={'w-full'}
              attributes={{
                ...(props.attributes as any),
                lockViewMode: true,
                viewMode: 'gutenberg_header',
                allowedTypes: ['image'],
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
            <div>
              <RichText
                identifier="ctaText"
                tagName="div"
                multiline={false}
                value={props.attributes.ctaText as string}
                allowedFormats={[]}
                // @ts-ignore
                disableLineBreaks={true}
                placeholder={__('CTA text')}
                keepPlaceholderOnFocus={true}
                style={{
                  cursor: 'text',
                }}
                onChange={(ctaText) => {
                  setPlainTextAttribute(props, 'ctaText', ctaText);
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
