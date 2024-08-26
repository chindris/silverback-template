import React, { Fragment } from 'react';
import { InspectorControls, RichText } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

const { t: __ } = Drupal;

// @ts-ignore
registerBlockType('custom/demo-block', {
  title: 'Demo Block',
  icon: 'text',
  category: 'common',
  attributes: {
    heading: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    mediaEntityIds: {
      type: 'array',
    },
    url: {
      type: 'string',
    },
  },
  // @ts-ignore
  edit: (props) => {
    const { attributes, setAttributes } = props;

    // Set default values this way so that values get saved in the block's attributes.
    //props.setAttributes({
    //  isQuote:
    //    props.attributes.isQuote === undefined
    //      ? false
    //      : props.attributes.isQuote,
    //});

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={__('Block settings')}>
            <p>Block settings</p>
          </PanelBody>
        </InspectorControls>
        <div className={'container-wrapper !border-stone-500'}>
          <div className={'container-label'}>{__('Demo Block')}</div>
          <div className="custom-block-demo-block">
            <RichText
              identifier="heading"
              tagName="p"
              value={attributes.heading as string}
              allowedFormats={[]}
              // @ts-ignore
              disableLineBreaks={true}
              placeholder={__('Heading')}
              keepPlaceholderOnFocus={true}
              onChange={(newValue) => {
                setAttributes({ heading: newValue });
              }}
            />
            <RichText
              identifier="description"
              tagName="p"
              value={attributes.description as string}
              allowedFormats={[]}
              // @ts-ignore
              disableLineBreaks={true}
              placeholder={__('Description')}
              keepPlaceholderOnFocus={true}
              onChange={(newValue) => {
                setAttributes({ description: newValue });
              }}
            />
            <DrupalMediaEntity
              classname={'w-full'}
              attributes={
                {
                  ...props.attributes,
                  lockViewMode: true,
                  allowedTypes: ['image'],
                } as object
              }
              setAttributes={props.setAttributes}
              isMediaLibraryEnabled={true}
              onError={(error) => {
                // @ts-ignore
                error = typeof error === 'string' ? error : error[2];
                dispatch('core/notices').createWarningNotice(error);
              }}
            />
            <RichText
              identifier="url"
              tagName="p"
              value={attributes.url as string}
              allowedFormats={[]}
              // @ts-ignore
              disableLineBreaks={true}
              placeholder={__('Url')}
              keepPlaceholderOnFocus={true}
              onChange={(newValue) => {
                setAttributes({ url: newValue });
              }}
            />
          </div>
        </div>
      </Fragment>
    );
  },

  save: () => {
    return null;
    // or uncomment this if you import and use InnerBlocks from wordpress__block-editor
    // return <InnerBlocks.Content />;
  },
});
