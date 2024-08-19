import clsx from 'clsx';
import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl, ToggleControl } from 'wordpress__components';
import { compose, withState } from 'wordpress__compose';

const { t: __ } = Drupal;

// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 15"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.83401 4.23435C9.98403 4.08437 10.1875 4.00012 10.3996 4.00012C10.6117 4.00012 10.8152 4.08437 10.9652 4.23435L14.1652 7.43435C14.3152 7.58437 14.3994 7.78782 14.3994 7.99995C14.3994 8.21208 14.3152 8.41553 14.1652 8.56555L10.9652 11.7656C10.8143 11.9113 10.6122 11.9919 10.4025 11.9901C10.1927 11.9883 9.99208 11.9041 9.84375 11.7558C9.69543 11.6075 9.61129 11.4068 9.60947 11.1971C9.60765 10.9873 9.68828 10.7852 9.83401 10.6344L11.6684 8.79995H2.39961C2.18744 8.79995 1.98395 8.71567 1.83392 8.56564C1.68389 8.41561 1.59961 8.21212 1.59961 7.99995C1.59961 7.78778 1.68389 7.5843 1.83392 7.43427C1.98395 7.28424 2.18744 7.19995 2.39961 7.19995H11.6684L9.83401 5.36555C9.68403 5.21553 9.59978 5.01208 9.59978 4.79995C9.59978 4.58782 9.68403 4.38437 9.83401 4.23435Z"
      className=" fill-blue-600 group-hover:fill-white transition-all duration-200 ease-in-out"
    />
  </svg>
);

// @ts-ignore
registerBlockType('custom/cta', {
  title: 'CTA',
  icon: 'admin-links',
  category: 'common',
  attributes: {
    url: {
      type: 'string',
    },
    text: {
      type: 'string',
    },
    // To have an easier integration with entity usage, we also retrieve and
    // store the uuid (data-id) and the entity type of internal links.
    'data-id': {
      type: 'string',
    },
    'data-entity-type': {
      type: 'string',
    },
    openInNewTab: {
      type: 'boolean',
    },
    icon: {
      type: 'string',
      default: 'NONE',
    },
    iconPosition: {
      type: 'string',
      default: 'AFTER',
    },
  },
  // @ts-ignore
  edit: compose(withState({}))((props) => {
    return (
      <div>
        <a
          className={clsx(
            {
              'flex-row-reverse': props.attributes.iconPosition === 'BEFORE',
            },
            'no-underline text-blue-600 hover:text-white font-medium hover:bg-blue-600 flex flex-row items-center border border-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg  py-2 px-3 gap-2 text-xs text-center w-fit transition-all duration-200 ease-in-out group',
          )}
        >
          <RichText
            identifier="text"
            tagName="span"
            value={props.attributes.text}
            allowedFormats={[]}
            // @ts-ignore
            disableLineBreaks={true}
            placeholder={__('Link text')}
            keepPlaceholderOnFocus={true}
            style={{
              cursor: 'text',
            }}
            onChange={(text: string) => {
              setPlainTextAttribute(props, 'text', text);
            }}
          />
          {typeof props.attributes.icon !== 'undefined' &&
            props.attributes.icon === 'ARROW' && <ArrowRightIcon />}
        </a>
        <InspectorControls>
          <PanelBody title={__('CTA Link')}>
            <LinkControl
              value={{
                url: props.attributes.url,
                openInNewTab: props.attributes.openInNewTab,
              }}
              settings={{}}
              // If you want to use a specific linkit profile for the suggestions,
              // then you can do that by using the 'suggestionsQuery' property, like
              // the one bellow, and change the 'subtype' property to the machine
              // name of the linkit profile. By default, the 'gutenberg' profile
              // is used. Of course, in this case, if the linkit profile can search
              // through multiple entity types, then you'll have to set the value
              // for 'data-entity-type' in the onChange() handler by yourself.

              //suggestionsQuery={{
              //  type: 'post',
              //  subtype: 'gutenberg',
              //}}
              // @ts-ignore
              onChange={(link) => {
                props.setAttributes({
                  url: link.url,
                  'data-id': link.id,
                  'data-entity-type':
                    // At the moment, the silverback_gutenberg link autocomplete
                    // controller does not return the machine name of the entity
                    // type. Instead, it returns the human readable, translated,
                    // entity type label. We should refactor the LinkAutocomplete
                    // controller to return the machine name of the entity type, and
                    // then we can set the data-entity-type value more accurate.
                    // Right now, we just make a "guess" based on the the human
                    // readable label for English and German.
                    link.type.startsWith('Media') ||
                    link.type.startsWith('Medien')
                      ? 'media'
                      : link.type !== 'URL'
                        ? 'node'
                        : '',
                });
              }}
            />
            <ToggleControl
              label={__('Open in new tab')}
              help={
                props.attributes.openInNewTab
                  ? __('Opens in a new tab.')
                  : __('Opens in the same tab.')
              }
              checked={props.attributes.openInNewTab}
              onChange={(openInNewTab) => {
                props.setAttributes({
                  openInNewTab,
                });
              }}
            />
            <SelectControl
              label={__('Icon')}
              value={props.attributes.icon}
              options={[
                { label: __('- None -'), value: 'NONE' },
                { label: __('Arrow'), value: 'ARROW' },
              ]}
              onChange={(icon) => {
                props.setAttributes({
                  icon,
                });
              }}
            />
            {typeof props.attributes.icon !== 'undefined' &&
              props.attributes.icon !== 'NONE' && (
                <SelectControl
                  label={__('Icon position')}
                  value={props.attributes.iconPosition}
                  options={[
                    { label: __('After button text'), value: 'AFTER' },
                    { label: __('Before button text'), value: 'BEFORE' },
                  ]}
                  onChange={(iconPosition) => {
                    props.setAttributes({
                      iconPosition,
                    });
                  }}
                />
              )}
          </PanelBody>
        </InspectorControls>
      </div>
    );
  }),

  save: () => {
    return null;
  },
});
