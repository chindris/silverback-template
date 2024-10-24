import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';
import { dispatch, useSelect } from 'wordpress__data';

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
    const { attributes, setAttributes } = props;
    const headingLevel = attributes.headingLevel;

    /* eslint-disable-next-line */
    const { children } = useSelect((select) => ({
      children: select('core/block-editor').getBlocksByClientId(props.clientId),
    }));

    if (children[0].innerBlocks) {
      children[0].innerBlocks.forEach((child: any) => {
        dispatch('core/editor').updateBlockAttributes(child.clientId, {
          headingLevel: headingLevel,
        });
      });
    }

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
              help={__('The heading level will be applied to all nested accordion items.')}
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
