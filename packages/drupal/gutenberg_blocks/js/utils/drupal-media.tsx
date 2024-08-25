type DrupalMediaComponent = React.FC<{
  classname?: string;
  isMediaLibraryEnabled?: boolean;
  isSelected?: boolean;
  clientId?: string;
  attributes: {
    mediaEntityIds?: [string];
    lockViewMode?: boolean;
    viewMode?: string;
    allowedTypes?: [string];
  };
  setAttributes: (attributes: object) => void;
  onError: (error: string | [string] | string[]) => void;
}>;

// @ts-ignore
export const DrupalMediaEntity = DrupalGutenberg.Components
  .DrupalMediaEntity as DrupalMediaComponent;
