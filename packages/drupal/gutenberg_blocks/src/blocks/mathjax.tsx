import { registerBlockType } from 'wordpress__blocks';
import { compose, withState } from 'wordpress__compose';

// @ts-ignore
const { t: __ } = Drupal;

registerBlockType(`custom/mathjax`, {
  title: __('MathJax'),
  category: 'layout',
  icon: 'media-document',
  attributes: {
    formula: {
      source: 'html',
      selector: 'div',
      type: 'string',
    },
  },
  // @ts-ignore
  edit: compose(withState({}))((props) => {
    const { isSelected, attributes, setAttributes, className } = props;
    const { formula } = attributes;
    const id = `mathjax-${Math.random().toString(36).substr(2, 9)}`;

    if (isSelected) {
      return (
        <div className={className}>
          <label htmlFor={id}>
            {__('Insert equation in TeX format', 'mathml-block')}
          </label>
          <textarea
            id={id}
            className="mathml-formula"
            onChange={(event) => {
              setAttributes({ formula: event.target.value });
            }}
            value={formula}
            style={{ width: '100%' }}
          />
        </div>
      );
    } else {
      return (
        <div id={id} className="mathjax">
          {formula}
        </div>
      );
    }
  }),

  save: function save({ attributes, className }) {
    const { formula } = attributes;

    return <div className={className}>{formula as string}</div>;
  },
});
