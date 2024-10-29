import clsx from 'clsx';
import { Fragment } from 'react';
import {
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';

const { t: __ } = Drupal;

registerBlockType<{
  title: string;
  icon?: string;
}>('custom/accordion-item-text', {
  title: 'Accordion Item Text',
  icon: 'text',
  category: 'layout',
  parent: ['custom/accordion'],
  usesContext: ['custom/accordion-headingLevel'],
  attributes: {
    title: {
      type: 'string',
      default: '',
    },
    icon: {
      type: 'string',
    },
  },
  edit: (props) => {
    const { attributes, setAttributes, context } = props;
    const icons = [
      { label: __('- Select an optional icon -'), value: '' },
      { label: __('Checkmark'), value: 'checkmark' },
      { label: __('Questionmark'), value: 'questionmark' },
      { label: __('Arrow'), value: 'arrow' },
    ];

    setAttributes({
      icon: attributes.icon === undefined ? '' : attributes.icon,
    });

    const headingLevel = context['custom/accordion-headingLevel'];

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={__('Heading Level')}>
            <div>
              {__('Heading level is defined in the parent accordion block.')}
            </div>
            <div>
              {__('Currently it is set to:')}{' '}
              <strong>{headingLevel as string}</strong>
            </div>
          </PanelBody>
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
        <div className={'container-wrapper !border-stone-500'}>
          <div className={'container-label'}>{__('Accordion Item Text')}</div>
          <div
            className={clsx(
              'custom-block-accordion-item-text',
              attributes.icon,
            )}
          >
            <RichText
              identifier="title"
              tagName={headingLevel as keyof HTMLElementTagNameMap}
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
  },

  save: () => {
    return <InnerBlocks.Content />;
  },
});
