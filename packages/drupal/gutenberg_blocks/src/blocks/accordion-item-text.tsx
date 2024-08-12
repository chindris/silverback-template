import clsx from 'clsx';
import React, { Fragment } from 'react';
import {
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';
import { compose, withState } from 'wordpress__compose';

// @ts-ignore
const { t: __ } = Drupal;
// @ts-ignore
registerBlockType('custom/accordion-item-text', {
  title: 'Accordion Item Text',
  icon: 'text',
  category: 'layout',
  parent: ['custom/accordion'],
  attributes: {
    title: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
  },
  // @ts-ignore
  edit: compose(withState())((props) => {
    const { attributes, setAttributes } = props;
    const icons = [
      { label: __('- Select an optional icon -'), value: '' },
      { label: __('Checkmark'), value: 'checkmark' },
      { label: __('Questionmark'), value: 'questionmark' },
      { label: __('Arrow'), value: 'arrow' },
    ];
    setAttributes({
      icon: attributes.icon === undefined ? '' : attributes.icon,
    });

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={__('Block settings')}>
            <SelectControl
              value={attributes.icon}
              options={icons}
              onChange={(newValue) => {
                setAttributes({
                  icon: newValue,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div className={'container-wrapper'}>
          <div className={'container-label'}>{__('Accordion Item Text')}</div>
          <div
            className={clsx(
              'custom-block-accordion-item-text',
              attributes.icon,
            )}
          >
            <RichText
              identifier="title"
              tagName="h3"
              value={attributes.title}
              allowedFormats={[]}
              // @ts-ignore
              disableLineBreaks={true}
              placeholder={__('Title')}
              keepPlaceholderOnFocus={true}
              onChange={(newValue) => {
                setAttributes({ title: newValue });
              }}
            />
            <InnerBlocks
              templateLock={false}
              allowedBlocks={['core/paragraph', 'core/list', 'custom/heading']}
              template={[['core/paragraph', {}]]}
            />
          </div>
        </div>
      </Fragment>
    );
  }),

  save: () => {
    return <InnerBlocks.Content />;
  },
});
