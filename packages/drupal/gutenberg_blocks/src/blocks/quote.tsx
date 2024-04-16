import { RichText } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { compose, withState } from 'wordpress__compose';
import { dispatch } from 'wordpress__data';

import { cleanUpText } from '../utils/clean-up-text';
import { DrupalMediaEntity } from '../utils/drupal-media';

declare const Drupal: { t: (s: string) => string };

const { t: __ } = Drupal;

// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

// @ts-ignore
registerBlockType(`custom/quote`, {
  title: __('Quote'),
  icon: 'format-quote',
  category: 'text',
  attributes: {
    text: {
      type: 'string',
    },
    author: {
      tpye: 'string',
    },
    role: {
      type: 'string',
    },
    mediaEntityIds: {
      type: 'array',
    },
  },
  // @ts-ignore
  edit: compose(withState())((props) => {
    return (
      <blockquote>
        <RichText
          identifier="text"
          value={props.attributes.text}
          allowedFormats={['core/bold']}
          // @ts-ignore
          disableLineBreaks={false}
          placeholder={__('Quote')}
          keepPlaceholderOnFocus={false}
          onChange={(text) => {
            props.setAttributes({
              text: cleanUpText(text),
            });
          }}
        />
        <RichText
          identifier="author"
          className="quote-author"
          value={props.attributes.author}
          allowedFormats={[]}
          // @ts-ignore
          disableLineBreaks={false}
          placeholder={__('Author')}
          keepPlaceholderOnFocus={false}
          onChange={(author) => {
            setPlainTextAttribute(props, 'author', author);
          }}
        />
        <RichText
          identifier="role"
          className="quote-role"
          value={props.attributes.role}
          allowedFormats={[]}
          // @ts-ignore
          disableLineBreaks={false}
          placeholder={__('Role')}
          keepPlaceholderOnFocus={false}
          onChange={(role) => {
            setPlainTextAttribute(props, 'role', role);
          }}
        />
        <DrupalMediaEntity
          classname={'w-full'}
          attributes={{
            ...props.attributes,
            lockViewMode: true,
            allowedTypes: ['image'],
          }}
          setAttributes={props.setAttributes}
          isMediaLibraryEnabled={true}
          onError={(error) => {
            // @ts-ignore
            error = typeof error === 'string' ? error : error[2];
            dispatch('core/notices').createWarningNotice(error);
          }}
        />
      </blockquote>
    );
  }),
  save() {
    return null;
  },
});
