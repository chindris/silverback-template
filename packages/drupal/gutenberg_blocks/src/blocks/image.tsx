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

registerBlockType('custom/image', {
  title: __('Image'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
  },
  edit: (props) => {
    return (
      <>
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
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
