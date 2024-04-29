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
    quote: {
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
      <div className="prose lg:prose-xl prose-p:text-xl prose-p:font-bold prose-p:leading-8 prose-p:text-gray-900">
        <blockquote>
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="quote-svg-title"
          >
            <path
              d="M18.6893 24V14.1453C18.6893 6.54 23.664 1.38533 30.6667 0L31.9933 2.868C28.7507 4.09066 26.6667 7.71867 26.6667 10.6667H32V24H18.6893ZM0 24V14.1453C0 6.54 4.99733 1.384 12 0L13.328 2.868C10.084 4.09066 8 7.71867 8 10.6667L13.3107 10.6667V24H0Z"
              fill="#9CA3AF"
            />
          </svg>
          <RichText
            identifier="quote"
            value={props.attributes.quote}
            allowedFormats={['core/bold']}
            // @ts-ignore
            disableLineBreaks={false}
            placeholder={__('Quote')}
            keepPlaceholderOnFocus={false}
            onChange={(quote) => {
              props.setAttributes({
                quote: cleanUpText(quote, ['strong']),
              });
            }}
          />
          <div className="flex not-prose items-center flex-wrap">
            <div className="mr-3 quote-image">
              <DrupalMediaEntity
                attributes={{
                  ...props.attributes,
                  lockViewMode: true,
                  allowedTypes: ['image'],
                  viewMode: 'quote',
                }}
                setAttributes={props.setAttributes}
                isMediaLibraryEnabled={true}
                onError={(error) => {
                  // @ts-ignore
                  error = typeof error === 'string' ? error : error[2];
                  dispatch('core/notices').createWarningNotice(error);
                }}
              />
            </div>
            <RichText
              identifier="author"
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
            <span className="ml-3 text-base">/</span>
            <RichText
              identifier="role"
              className="mt-0.5 not-italic text-gray-500 text-sm ml-3"
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
          </div>
        </blockquote>
      </div>
    );
  }),
  save() {
    return null;
  },
});
