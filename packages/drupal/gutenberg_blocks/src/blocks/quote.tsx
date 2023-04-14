import { RichText } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { compose, withState } from 'wordpress__compose';

// @ts-ignore
const __ = Drupal.t;
// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType('content/quote', {
  title: __('Quote'),
  category: 'text',
  // Find other icons like this here: https://developer.wordpress.org/resource/dashicons/#format-quote
  icon: 'format-quote',
  attributes: {
    quote: {
      type: 'string',
    },
  },
  // @ts-ignore
  edit: compose(withState({}))((props) => {
    return (
      <blockquote>
        <RichText
          identifier="quote"
          tagName="p"
          value={props.attributes.quote}
          allowedFormats={[]}
          // @ts-ignore
          disableLineBreaks={true}
          placeholder={__('Quote')}
          keepPlaceholderOnFocus={true}
          onChange={(quote: string) => {
            setPlainTextAttribute(props, 'quote', quote);
          }}
        />
      </blockquote>
    );
  }),

  save: () => {
    return null;
  },
});
