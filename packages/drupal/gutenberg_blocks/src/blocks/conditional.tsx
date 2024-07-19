import clsx from 'clsx';
import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { BaseControl, PanelBody } from 'wordpress__components';

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
    purpose: {
      type: 'string',
      default: '',
    },
  },
  edit(props) {
    const { attributes, setAttributes } = props;

    const displayFrom = attributes.displayFrom as string | undefined;
    const displayTo = attributes.displayTo as string | undefined;
    const purpose = ((attributes.purpose as string) || '').trim();

    // Same logic as in BlockConditional.tsx
    const active = {
      scheduledDisplay: [
        displayFrom
          ? new Date(displayFrom).getTime() <= new Date().getTime()
          : true,
        displayTo ? new Date(displayTo).getTime() > new Date().getTime() : true,
      ].every(Boolean),
    };
    const isActive = Object.values(active).every(Boolean);

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
      <div className={clsx('container-wrapper', { 'bg-gray-100': !isActive })}>
        <div className={'container-label'}>{__('Conditional content')}</div>
        <div className="text-sm text-gray-500">{summary}</div>
        <details open={isActive}>
          <summary
            style={{ cursor: 'pointer', padding: 0 }}
            className="text-sm text-gray-500"
          >
            {purpose || __('Content')}
          </summary>
          <InnerBlocks
            templateLock={false}
            template={[['core/paragraph', {}]]}
          />
        </details>
        <InspectorControls>
          <PanelBody title={__('Purpose')}>
            <BaseControl id="purpose">
              <input
                type="text"
                id="purpose"
                defaultValue={purpose}
                onChange={(event) => {
                  setAttributes({ purpose: event.target.value });
                }}
              />
            </BaseControl>
            <BaseControl
              id="purpose-decription"
              label={__(
                'The value is not exposed to the frontend and serves to identify the reason of the conditional content (e.g. Summer Campaign).',
              )}
            >
              <div />
            </BaseControl>
          </PanelBody>
          <PanelBody title={__('Scheduled display')}>
            <BaseControl id="displayFrom" label={__('From')}>
              <br />
              <input
                type="datetime-local"
                id="displayFrom"
                defaultValue={displayFrom ? isoToLocalTime(displayFrom) : ''}
                onChange={(event) => {
                  setAttributes({
                    displayFrom: event.target.value
                      ? localToIsoTime(event.target.value)
                      : '',
                  });
                }}
              />
            </BaseControl>
            <BaseControl id="displayTo" label={__('To')}>
              <br />
              <input
                type="datetime-local"
                id="displayTo"
                defaultValue={displayTo ? isoToLocalTime(displayTo) : ''}
                onChange={(event) => {
                  setAttributes({
                    displayTo: event.target.value
                      ? localToIsoTime(event.target.value)
                      : '',
                  });
                }}
              />
            </BaseControl>
            <BaseControl
              id="decription"
              label={
                __('Time zone') +
                ': ' +
                Intl.DateTimeFormat().resolvedOptions().timeZone
              }
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

function localToIsoTime(localTime: string) {
  return new Date(localTime).toISOString();
}

function isoToLocalTime(isoTime: string) {
  const date = new Date(isoTime);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}
