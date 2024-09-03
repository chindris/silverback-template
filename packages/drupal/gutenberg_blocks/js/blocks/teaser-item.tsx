import {
  // @ts-ignore
  __experimentalLinkControl as LinkControl,
} from 'wordpress__block-editor';
import { registerBlockType } from 'wordpress__blocks';

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

  edit: ({
    attributes: { url },
    setAttributes,
  }: {
    attributes: {
      url: string;
      uuid: string;
      entityType: string;
    };
    setAttributes: (attributes: {
      url?: string;
      uuid?: string;
      entityType?: string;
    }) => void;
  }) => {
    return (
      <div>
        <LinkControl
          value={{
            url: url,
          }}
          settings={{}}
          suggestionsQuery={{
            type: 'post',
            // Use the teaser_list linkit profile to fetch suggestions.
            subtype: 'teaser_list',
          }}
          onChange={(link: { url: string; id: string; type: string }) => {
            setAttributes({
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
