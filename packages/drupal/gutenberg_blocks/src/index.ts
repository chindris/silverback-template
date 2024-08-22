import './customisations';
import './preview';
import './blocks/hero';
import './blocks/content';
import './blocks/heading';
import './blocks/form';
import './blocks/image-teaser';
import './blocks/image-teasers';
import './blocks/image-with-text';
import './filters/list';
import './blocks/cta';
import './blocks/quote';
import './blocks/conditional';
import './blocks/horizontal-separator';
import './blocks/accordion';
import './blocks/accordion-item-text';
import './blocks/info-grid';
import './blocks/info-grid-item';
import './blocks/teaser-list';
import './blocks/teaser-item';

declare global {
  const Drupal: {
    behaviors: any;
    t: (s: string, t?: object) => string;
  };

  const silverbackGutenbergUtils: {
    sanitizeText: (text: string) => string;
    setPlainTextAttribute: (props: any, name: string, text: string) => void;
  };

  const drupalSettings: {
    preview: any;
    path: {
      baseUrl: string;
      pathPrefix: string;
    };
    customGutenbergBlocks: {
      forms: Array<{
        id: string;
        url: string;
        label: string;
      }>;
    };
  };
}
