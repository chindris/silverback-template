import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from 'wordpress__components';

// @ts-ignore
const { t: __ } = Drupal;

// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

// @ts-ignore
registerBlockType('custom/teaser-list', {
  title: __('Teaser list'),
  icon: 'slides',
  category: 'layout',
  attributes: {
    layout: {
      type: 'string',
      default: 'GRID',
    },
    buttonText: {
      type: 'string',
    },
    contentHubEnabled: {
      type: 'boolean',
    },
    limit: {
      type: 'string',
    },
    titleFilter: {
      typ: 'string',
    },
  },
  edit: (props) => {
    return (
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Teaser list')}</div>
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={__('Layout')}
              value={props.attributes.layout as string}
              options={[
                { label: __('Grid'), value: 'GRID' },
                { label: __('Carousel'), value: 'CAROUSEL' },
              ]}
              onChange={(layout) => {
                props.setAttributes({
                  layout,
                });
              }}
            />
            <TextControl
              value={props.attributes.buttonText as string}
              label={__('Button text')}
              onChange={(buttonText: string) => {
                setPlainTextAttribute(props, 'buttonText', buttonText);
              }}
              help={__(
                'A text to show for the read more link. Leave empty to use the default one (Read more).',
              )}
            />
            <ToggleControl
              label={__('Enable content hub')}
              help={__('Enable pulling dynamic content from the content hub.')}
              checked={props.attributes.contentHubEnabled as boolean}
              onChange={(contentHubEnabled) => {
                props.setAttributes({
                  contentHubEnabled,
                });
              }}
            />
            {typeof props.attributes.contentHubEnabled !== 'undefined' &&
            props.attributes.contentHubEnabled ? (
              <TextControl
                label={__('Filter: Title')}
                help={__('Filter results by title / label.')}
                onChange={(titleFilter) => {
                  props.setAttributes({
                    titleFilter,
                  });
                }}
                value={props.attributes.titleFilter as string}
              />
            ) : null}
            {typeof props.attributes.contentHubEnabled !== 'undefined' &&
            props.attributes.contentHubEnabled ? (
              <TextControl
                label={__('Limit')}
                help={__(
                  'Set a maximum number of results to show from the content hub.',
                )}
                onChange={(limit) => {
                  props.setAttributes({
                    limit,
                  });
                }}
                value={props.attributes.limit as string}
              />
            ) : null}
          </PanelBody>
        </InspectorControls>
        <InnerBlocks
          templateLock={false}
          allowedBlocks={['custom/teaser-item']}
          template={[]}
        />
      </div>
    );
  },
  save: () => <InnerBlocks.Content />,
});
