import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, ToggleControl } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/image-with-link', {
  title: __('Image with Link'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    link: {
      type: 'string',
    },
    uuid: {
      type: 'string',
    },
  },
  edit: (props) => {
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Settings')}>
            <LinkControl
              value={{url: props.attributes.link}}
              settings={{}}
              onChange={(link: any) => {
                props.setAttributes({
                  link: link.url,
                  uuid: link.id,
                })
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div className={'container-wrapper'}>
          <div className={'container-label'}>{__('Image with Link')}</div>
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
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
