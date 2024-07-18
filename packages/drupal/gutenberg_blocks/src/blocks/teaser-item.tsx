import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

// @ts-ignore
registerBlockType('custom/teaser-item', {
  title: 'Teaser item',
  icon: 'slides',
  category: 'layout',
  parent: ['custom/teaser-list'],
  attributes: {
    url: {
      type: 'string',
    },
    // To have an easier integration with entity usage, we also retrieve and
    // store the uuid and the entity type of internal links.
    uuid: {
      type: 'string',
    },
    entityType: {
      type: 'string',
    },
  },
  // @ts-ignore
  edit: (props) => {
    return (
      <div>
        <LinkControl
          value={{
            url: props.attributes.url,
          }}
          settings={{}}
          suggestionsQuery={{
            type: 'post',
            // Use the teaser_list linkit profile to fetch suggestions.
            subtype: 'teaser_list',
          }}
          // @ts-ignore
          onChange={(link) => {
            props.setAttributes({
              url: link.url,
              uuid: link.id,
              // At the moment, the teaser_list link autocomplete only
              // returns nodes.
              // For a more complex case, check the cta component.
              entityType: link.type !== 'URL' ? 'node' : '',
            });
          }}
        />
      </div>
    );
  },

  save: () => {
    return null;
  },
});
