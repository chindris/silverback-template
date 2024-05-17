import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { BaseControl, PanelBody } from 'wordpress__components';

declare const drupalSettings: {
  customGutenbergBlocks: {
    timezone: string;
  };
};

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType(`custom/conditional`, {
  title: __('Conditional content'),
  category: 'layout',
  icon: 'category',
  // Allow the block only at the root level to avoid GraphQL fragment recursion.
  parent: ['custom/content'],
  attributes: {
    displayFrom: {
      type: 'string',
      default: '',
    },
    displayTo: {
      type: 'string',
      default: '',
    },
  },
  edit(props) {
    const { attributes, setAttributes } = props;

    const displayFrom = attributes.displayFrom as string | undefined;
    const displayTo = attributes.displayTo as string | undefined;

    const conditions = {
      scheduledDisplay:
        displayFrom || displayTo
          ? '🕒 ' +
            __('Scheduled display') +
            ': ' +
            [
              displayFrom
                ? __('From') + ' ' + new Date(displayFrom).toLocaleString()
                : '',
              displayTo
                ? __('To') + ' ' + new Date(displayTo).toLocaleString()
                : '',
            ]
              .filter(Boolean)
              .join(' ')
          : '',
    };
    const hasConditions = Object.values(conditions).some(Boolean);
    const summary = hasConditions ? (
      Object.entries(conditions)
        .filter(([, value]) => !!value)
        .map(([key, value]) => <div key={key}>{value}</div>)
    ) : (
      <div>{'ℹ️ ' + __('No conditions set')}</div>
    );

    return (
      <div className={'container-wrapper'}>
        <div className={'container-label'}>{__('Conditional content')}</div>
        <div className="text-sm text-gray-500">{summary}</div>
        <InnerBlocks templateLock={false} template={[['core/paragraph', {}]]} />
        <InspectorControls>
          <PanelBody title={__('Scheduled display')}>
            <BaseControl id="displayFrom" label={__('From')}>
              <br />
              <input
                type="datetime-local"
                id="displayFrom"
                defaultValue={displayFrom}
                onChange={(event) => {
                  setAttributes({ displayFrom: event.target.value });
                }}
              />
            </BaseControl>
            <BaseControl id="displayTo" label={__('To')}>
              <br />
              <input
                type="datetime-local"
                id="displayTo"
                defaultValue={displayTo}
                onChange={(event) => {
                  setAttributes({ displayTo: event.target.value });
                }}
              />
            </BaseControl>
            <BaseControl
              id="decription"
              label={__(
                __('Time zone') +
                  ': ' +
                  drupalSettings.customGutenbergBlocks.timezone,
              )}
            >
              <div />
            </BaseControl>
          </PanelBody>
        </InspectorControls>
      </div>
    );
  },

  save() {
    return <InnerBlocks.Content />;
  },
});
