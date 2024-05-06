import {
  BlockControls,
  InnerBlocks,
  InspectorControls,
  RichText,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl, ToolbarGroup } from 'wordpress__components';
import { compose, withState } from 'wordpress__compose';
import { dispatch } from 'wordpress__data';

import { DrupalMediaEntity } from '../utils/drupal-media';
import { HeadingLevelIcon } from './heading';

// @ts-ignore
const __ = Drupal.t;

// @ts-ignore
const { setPlainTextAttribute } = silverbackGutenbergUtils;

registerBlockType('custom/slider-item', {
  title: __('Slider Item'),
  category: 'text',
  icon: 'text',
  attributes: {
    title: {
      type: 'string',
    },
    headingLevel: {
      type: 'number',
      default: 2,
    },
    contentAlignment: {
      type: 'string',
      default: 'LEFT',
    },
  },
  // @ts-ignore
  edit: compose(withState({}))((props) => {
    const { attributes, setAttributes, className } = props;
    const { title, headingLevel, contentAlignment } = attributes;
    return (
      <div className={'container-wrapper'}>
        <InspectorControls>
          <PanelBody title={__('Settings')}>
            <SelectControl
              label={__('Content alignment')}
              options={[
                { label: __('Left'), value: 'LEFT' },
                { label: __('Right'), value: 'RIGHT' },
              ]}
              value={contentAlignment || 'LEFT'}
              onChange={(contentAlignment) => {
                setAttributes({
                  contentAlignment,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <div className={'container-label'}>{__('Slider item')}</div>
        <div className={'two-columns'}>
          {contentAlignment === 'RIGHT' && (
            <>
              <div>
                <figure className={className}>
                  <DrupalMediaEntity
                    attributes={{
                      ...attributes,
                      lockViewMode: true,
                      viewMode: 'default',
                      allowedTypes: ['image'],
                    }}
                    setAttributes={setAttributes}
                    isMediaLibraryEnabled={true}
                    onError={(error) => {
                      // @ts-ignore
                      error = typeof error === 'string' ? error : error[2];
                      dispatch('core/notices').createWarningNotice(error);
                    }}
                  />
                </figure>
              </div>
              <div>
                <BlockControls>
                  <ToolbarGroup
                    controls={[2, 3, 4].map((level) => {
                      const isActive = level === headingLevel;
                      return {
                        icon: (
                          <HeadingLevelIcon level={level} isPressed={false} />
                        ),
                        title: __('Heading @level', { '@level': level }),
                        isActive,
                        onClick: () => {
                          setAttributes({
                            headingLevel: level,
                          });
                        },
                      };
                    })}
                  />
                </BlockControls>
                <RichText
                  className={'mb-5'}
                  identifier="title"
                  tagName={`h${headingLevel}` as keyof HTMLElementTagNameMap}
                  value={title}
                  allowedFormats={[]}
                  // @ts-ignore
                  disableLineBreaks={true}
                  placeholder={__('Title')}
                  keepPlaceholderOnFocus={true}
                  onChange={(title) => {
                    setPlainTextAttribute(props, 'title', title);
                  }}
                />
                <InnerBlocks
                  templateLock={false}
                  template={[['core/paragraph', {}]]}
                  allowedBlocks={['core/list', 'core/paragraph', 'custom/cta']}
                />
              </div>
            </>
          )}
          {contentAlignment === 'LEFT' && (
            <>
              <div>
                <BlockControls>
                  <ToolbarGroup
                    controls={[2, 3, 4].map((level) => {
                      const isActive = level === headingLevel;
                      return {
                        icon: (
                          <HeadingLevelIcon level={level} isPressed={false} />
                        ),
                        title: __('Heading @level', { '@level': level }),
                        isActive,
                        onClick: () => {
                          setAttributes({
                            headingLevel: level,
                          });
                        },
                      };
                    })}
                  />
                </BlockControls>
                <RichText
                  className={'mb-5'}
                  identifier="title"
                  tagName={`h${headingLevel}` as keyof HTMLElementTagNameMap}
                  value={title}
                  allowedFormats={[]}
                  // @ts-ignore
                  disableLineBreaks={true}
                  placeholder={__('Title')}
                  keepPlaceholderOnFocus={true}
                  onChange={(title) => {
                    setPlainTextAttribute(props, 'title', title);
                  }}
                />
                <InnerBlocks
                  templateLock={false}
                  template={[['core/paragraph', {}]]}
                  allowedBlocks={['core/list', 'core/paragraph', 'custom/cta']}
                />
              </div>
              <div>
                <figure className={className}>
                  <DrupalMediaEntity
                    attributes={{
                      ...attributes,
                      lockViewMode: true,
                      viewMode: 'default',
                      allowedTypes: ['image'],
                    }}
                    setAttributes={setAttributes}
                    isMediaLibraryEnabled={true}
                    onError={(error) => {
                      // @ts-ignore
                      error = typeof error === 'string' ? error : error[2];
                      dispatch('core/notices').createWarningNotice(error);
                    }}
                  />
                </figure>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }),

  save: () => {
    return <InnerBlocks.Content />;
  },
});
