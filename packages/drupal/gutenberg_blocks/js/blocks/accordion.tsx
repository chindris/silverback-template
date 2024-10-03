import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';

const { t: __ } = Drupal;

enum HeadingLevels {
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
}

registerBlockType<{
  headingLevel: string;
}>('custom/accordion', {
  title: __('Accordion'),
  icon: 'menu',
  category: 'layout',
  attributes: {
    headingLevel: {
      type: 'string',
      default: HeadingLevels.H2,
    },
  },
  edit: (props) => {
    const { setAttributes } = props;

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Heading Level')}>
            <SelectControl
              value={props.attributes.headingLevel}
              options={[
                {
                  label: __('Heading 2'),
                  value: HeadingLevels.H2,
                },
                {
                  label: __('Heading 3'),
                  value: HeadingLevels.H3,
                },
                {
                  label: __('Heading 4'),
                  value: HeadingLevels.H4,
                },
                {
                  label: __('Heading 5'),
                  value: HeadingLevels.H5,
                },
              ]}
              onChange={(headingLevel: string) => {
                setAttributes({ headingLevel });
              }}
            />
          </PanelBody>
        </InspectorControls>

        <div className={'container-wrapper !border-stone-500'}>
          <div className={'container-label'}>{__('Accordion')}</div>
          <InnerBlocks
            templateLock={false}
            allowedBlocks={['custom/accordion-item-text']}
            template={[['custom/accordion-item-text']]}
          />
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
