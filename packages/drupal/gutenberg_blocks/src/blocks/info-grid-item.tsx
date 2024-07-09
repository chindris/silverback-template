import { InnerBlocks, InspectorControls } from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';
import { PanelBody, SelectControl } from 'wordpress__components';

import {
  iconImagePreview,
  Icons,
  limitedIconListOption,
} from '../utils/icon-list';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType('custom/info-grid-item', {
  title: __('Info Grid Item'),
  icon: 'align-wide',
  category: 'layout',
  parent: ['custom/info-grid'],
  attributes: {
    icon: {
      type: 'string',
      default: '',
    },
  },
  edit: (props) => {
    const { setAttributes } = props;
    const iconPreview = iconImagePreview(props.attributes.icon as string);

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Select an icon')}>
            <SelectControl
              value={props.attributes.icon as string}
              options={limitedIconListOption([
                Icons.EMAIL,
                Icons.PHONE,
                Icons.LIFE_RING,
              ])}
              onChange={(icon: string) => {
                setAttributes({ icon });
              }}
            />
          </PanelBody>
        </InspectorControls>

        <div className={'container-wrapper'}>
          <div className={'container-label'}>{__('Info Grid Item')}</div>
          <div className={'info-grid-icon'} style={{ maxWidth: '50px' }}>
            {iconPreview && (
              <img src={iconPreview} alt={props.attributes.icon as string} />
            )}
          </div>
          <InnerBlocks
            templateLock={false}
            allowedBlocks={['custom/heading', 'core/paragraph', 'custom/cta']}
          />
        </div>
      </>
    );
  },
  save: () => <InnerBlocks.Content />,
});
