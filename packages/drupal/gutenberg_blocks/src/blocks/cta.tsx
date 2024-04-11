import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { ToggleControl } from 'wordpress__components';
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
    // store the uuid of internal links.
    uuid: {
      type: 'string',
    },
    openInNewTab: {
      type: 'boolean',
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
        <LinkControl
          value={{
            url: props.attributes.url,
            openInNewTab: props.attributes.openInNewTab,
          }}
          settings={{}}
          // @ts-ignore
          onChange={(link) => {
            props.setAttributes({
              url: link.url,
              uuid: link.id,
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
      </div>
    );
  }),

  save: () => {
    return null;
  },
});
