import {
  __experimentalLinkControl as LinkControl,
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';

const { t: __ } = Drupal;
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType<{
  mediaEntityIds?: [string];
  headline: string;
  lead: string;
  ctaUrl?: string;
  ctaText: string;
  ctaOpenInNewTab: boolean;
  showLinkControl: boolean;
  formId?: string;
}>('custom/hero', {
  title: __('Hero'),
  icon: 'cover-image',
  category: 'layout',
  attributes: {
    mediaEntityIds: {
      type: 'array',
    },
    headline: {
      type: 'string',
      default: '',
    },
    lead: {
      type: 'string',
      default: '',
    },
    ctaUrl: {
      type: 'string',
    },
    ctaText: {
      type: 'string',
      default: '',
    },
    ctaOpenInNewTab: {
      type: 'boolean',
      default: false,
    },
    showLinkControl: {
      type: 'boolean',
      default: true,
    },
    formId: {
      type: 'string',
    },
  },
  supports: {
    inserter: false,
    align: false,
    html: false,
  },

  edit: (props) => {
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('CTA Link')}>
            {!!props.attributes.showLinkControl && (
              <LinkControl
                placeholder={__('Link')}
                value={{
                  url: props.attributes.ctaUrl,
                  openInNewTab: props.attributes.ctaOpenInNewTab,
                }}
                settings={{}}
                onChange={(link: { url: string; opensInNewTab: boolean }) => {
                  props.setAttributes({
                    ctaUrl: link.url,
                    ctaOpenInNewTab: link.opensInNewTab,
                  });
                }}
              />
            )}
            {!!props.attributes.ctaUrl && (
              <button
                type="button"
                style={{ marginTop: '24px' }}
                onClick={() => {
                  props.setAttributes({
                    ctaUrl: '',
                    ctaOpenInNewTab: undefined,
                    showLinkControl: false,
                  });
                  setTimeout(
                    () => props.setAttributes({ showLinkControl: true }),
                    0,
                  );
                }}
              >
                {__('Remove')}
              </button>
            )}
          </PanelBody>
          <PanelBody title={__('Form')}>
            <SelectControl
              value={props.attributes.formId}
              options={[
                { label: __('- Select a form -'), value: '' },
                ...drupalSettings.customGutenbergBlocks.forms.map((form) => ({
                  label: form.label,
                  value: form.id,
                })),
              ]}
              onChange={(formId) => {
                props.setAttributes({
                  formId,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div>
          <div>
            <DrupalMediaEntity
              classname={'w-full'}
              attributes={{
                ...props.attributes,
                lockViewMode: true,
                viewMode: 'gutenberg_header',
                allowedTypes: ['image'],
              }}
              setAttributes={props.setAttributes}
              isMediaLibraryEnabled={true}
              onError={(error) => {
                error = typeof error === 'string' ? error : error[2];
                dispatch('core/notices').createWarningNotice(error);
              }}
            />
          </div>

          <div className={'prose lg:prose-xl mt-10'}>
            <div>
              <h1>
                <RichText
                  className={'mt-10'}
                  identifier="headline"
                  tagName="span"
                  value={props.attributes.headline}
                  allowedFormats={[]}
                  disableLineBreaks={true}
                  placeholder={__('Headline')}
                  keepPlaceholderOnFocus={true}
                  onChange={(headline) => {
                    setPlainTextAttribute(props, 'headline', headline);
                  }}
                />
              </h1>
            </div>
            <div>
              <RichText
                identifier="lead"
                tagName="p"
                value={props.attributes.lead}
                allowedFormats={[]}
                disableLineBreaks={true}
                placeholder={__('Lead text')}
                keepPlaceholderOnFocus={true}
                onChange={(lead) => {
                  setPlainTextAttribute(props, 'lead', lead);
                }}
              />
            </div>
            <>
              {props.attributes.ctaUrl && (
                <div>
                  <RichText
                    identifier="ctaText"
                    className={`button`}
                    tagName="p"
                    multiline={false}
                    value={props.attributes.ctaText}
                    allowedFormats={[]}
                    disableLineBreaks={true}
                    placeholder={__('CTA text')}
                    keepPlaceholderOnFocus={true}
                    style={{
                      cursor: 'text',
                    }}
                    onChange={(ctaText) => {
                      setPlainTextAttribute(props, 'ctaText', ctaText);
                    }}
                  />
                </div>
              )}
            </>
            {props.attributes.formId ? (
              <iframe
                src={
                  drupalSettings.customGutenbergBlocks.forms.find(
                    (form) => form.id === props.attributes.formId,
                  )!.url + '?iframe=true'
                }
                style={{ width: '100%', height: 300, pointerEvents: 'none' }}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
