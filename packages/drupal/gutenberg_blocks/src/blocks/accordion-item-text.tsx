import React, { Fragment } from 'react';
import { InspectorControls, RichText } from 'wordpress__block-editor';
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
    text: {
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
          <div className="custom-block-accordion-item-text">
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
            <RichText
              identifier="text"
              tagName="p"
              value={attributes.text}
              allowedFormats={['core/bold', 'core/italic']}
              placeholder={__('Text')}
              keepPlaceholderOnFocus={true}
              onChange={(newValue) => {
                setAttributes({ text: newValue });
              }}
            />
          </div>
        </div>
      </Fragment>
    );
  }),

  save() {
    return null;
  },
});
