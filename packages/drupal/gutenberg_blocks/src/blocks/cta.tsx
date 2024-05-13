import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl, ToggleControl } from 'wordpress__components';
import { compose, withState } from 'wordpress__compose';

// @ts-ignore
const { t: __ } = Drupal;

// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

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
        <RichText
          identifier="text"
          className={`button`}
          tagName="p"
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
