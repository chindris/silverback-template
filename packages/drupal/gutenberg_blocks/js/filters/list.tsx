import clsx from 'clsx';
import { InspectorControls } from 'wordpress__block-editor';
import { PanelBody, SelectControl } from 'wordpress__components';
import { createHigherOrderComponent } from 'wordpress__compose';
import { addFilter } from 'wordpress__hooks';

const { t: __ } = Drupal;

addFilter(
  'blocks.registerBlockType',
  'custom/list',
  (settings: { name: string; attributes: any }) => {
    if (settings.name === 'core/list') {
      settings.attributes = Object.assign(settings.attributes, {
        customListStyle: {
          type: 'string',
          default: '',
        },
      });
    }
    return settings;
  },
);

addFilter<any>(
  'editor.BlockEdit',
  'custom/list',
  createHigherOrderComponent(
    // eslint-disable-next-line react/display-name
    (BlockEdit) => (props) => {
      const { name, attributes, setAttributes, isSelected } = props;
      const { customListStyle, ordered } = attributes;

      if (!customListStyle === undefined) {
        setAttributes({ customListStyle: '' });
      }

      return (
        <>
          <BlockEdit {...props} />
          {isSelected && name === 'core/list' && !ordered ? (
            <InspectorControls>
              <PanelBody title={__('List style')}>
                <SelectControl
                  value={props.attributes.customListStyle}
                  options={[
                    { label: __('Bullets'), value: '' },
                    { label: __('Arrows'), value: 'arrows' },
                    { label: __('Checkmarks'), value: 'checkmarks' },
                    { label: __('Question marks'), value: 'question-marks' },
                  ]}
                  onChange={(customListStyle: string) => {
                    setAttributes({
                      customListStyle,
                    });
                  }}
                />
              </PanelBody>
            </InspectorControls>
          ) : null}
        </>
      );
    },
    'withCustomListStyleControls',
  ),
);

addFilter<any>(
  'editor.BlockListBlock',
  'custom/list',
  createHigherOrderComponent(
    // eslint-disable-next-line react/display-name
    (BlockListBlock) => (props) => {
      const { name, attributes } = props;
      if (name === 'core/list') {
        const { customListStyle, ordered } = attributes;
        if (!ordered && customListStyle) {
          props.className = getCustomListClass(
            props.className,
            customListStyle,
          );
        }
      }
      return <BlockListBlock {...props} />;
    },
    'withCustomListStyleBlockClass',
  ),
);

addFilter(
  'blocks.getSaveContent.extraProps',
  'custom/list',
  (props: any, blockType: { name: string }, attributes: any) => {
    if (blockType.name === 'core/list') {
      const { customListStyle, ordered } = attributes;
      if (!ordered && customListStyle) {
        props.className = getCustomListClass(props.className, customListStyle);
      }
    }
    return props;
  },
);

function getCustomListClass(existingClassName: string, style: string) {
  return clsx(existingClassName, 'list-style--' + style);
}
