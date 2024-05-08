import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, ToggleControl } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/image-with-caption', {
  title: __('Image with Caption'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    useModal: {
      type: 'boolean',
      default: false,
    },
  },
  edit: (props) => {
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Settings')}>
            <ToggleControl
              label={__('Use Modal')}
              checked={props.attributes.useModal as boolean}
              onChange={(useModal) => {
                props.setAttributes({
                  useModal,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div className={'container-wrapper'}>
          <div className={'container-label'}>{__('Image with Caption')}</div>
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
          <h4>{__('Caption')}</h4>
          <InnerBlocks
            templateLock={false}
            allowedBlocks={[
              // Only markup blocks.
              'core/paragraph',
              'core/list',
              'core/table',
              'core/quote',
              'custom/heading',
            ]}
            template={[['core/paragraph']]}
          />
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
