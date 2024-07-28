import clsx from 'clsx';
import { PropsWithChildren, useState } from 'react';
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
      <>
        <CollapsibleContainer
          title={purpose || __('Conditional content')}
          label={__('Conditional content')}
          isActive={isActive}
        >
          <div className="text-sm text-gray-500">{summary}</div>
          <InnerBlocks
            templateLock={false}
            template={[['core/paragraph', {}]]}
          />
        </CollapsibleContainer>
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
      </>
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

function CollapsibleContainer({
  children,
  label,
  title,
  isActive,
}: PropsWithChildren<{ label: string; title: string; isActive: boolean }>) {
  const [isOpen, setIsOpen] = useState(isActive);
  return (
    <div
      className={clsx('collapsible-container', {
        'bg-gray-100': !isActive,
        'is-open': isOpen,
      })}
    >
      <div
        className="title"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="left"></div>
        <div className="text-gray-500 right">{title}</div>
      </div>

      {isOpen ? (
        <div
          className={clsx('container-wrapper no-margin', {
            'no-min-height': !isOpen,
          })}
        >
          <div className={'container-label'}>{label}</div>
          {children}
        </div>
      ) : null}
    </div>
  );
}
