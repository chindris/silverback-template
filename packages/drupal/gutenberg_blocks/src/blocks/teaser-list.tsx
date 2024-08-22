import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from 'wordpress__components';

const { t: __ } = Drupal;
const { setPlainTextAttribute } = silverbackGutenbergUtils;

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
      type: 'string',
    },
  },
  edit: (props: {
    attributes: {
      layout: string;
      buttonText: string;
      contentHubEnabled: boolean;
      limit: string;
      titleFilter: string;
    };
    setAttributes: (attributes: {
      layout?: string;
      buttonText?: string;
      contentHubEnabled?: boolean;
      limit?: string;
      titleFilter?: string;
    }) => void;
  }) => {
    const { attributes, setAttributes } = props;
    const { layout, buttonText, contentHubEnabled, limit, titleFilter } =
      attributes;

    return (
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Teaser list')}</div>
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={__('Layout')}
              value={layout}
              options={[
                { label: __('Grid'), value: 'GRID' },
                { label: __('Carousel'), value: 'CAROUSEL' },
              ]}
              onChange={(layout) => {
                setAttributes({
                  layout,
                });
              }}
            />
            <TextControl
              value={buttonText}
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
              checked={contentHubEnabled}
              onChange={(contentHubEnabled) => {
                setAttributes({
                  contentHubEnabled,
                });
              }}
            />
            {typeof contentHubEnabled !== 'undefined' && contentHubEnabled ? (
              <TextControl
                label={__('Filter: Title')}
                help={__('Filter results by title / label.')}
                onChange={(titleFilter) => {
                  setAttributes({
                    titleFilter,
                  });
                }}
                value={titleFilter}
              />
            ) : null}
            {typeof contentHubEnabled !== 'undefined' && contentHubEnabled ? (
              <TextControl
                label={__('Limit')}
                help={__(
                  'Set a maximum number of results to show from the content hub.',
                )}
                onChange={(limit) => {
                  setAttributes({
                    limit,
                  });
                }}
                value={limit}
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
