import { Button } from 'wordpress__components';
import { PluginSidebar } from 'wordpress__edit-post';
import { registerPlugin } from 'wordpress__plugins';

declare const drupalSettings: {
  preview: {
    previewUrl: string;
  };
};

// @ts-ignore
const { t: __ } = Drupal;

const PreviewSidebar = () => {
  const previewWindows = [
    {
      label: __('Mobile'),
      width: 375,
      height: 725,
      iconPath: '/modules/contrib/silverback_external_preview/icons/mobile.svg',
    },
    {
      label: __('Tablet'),
      width: 1024,
      height: 824,
      iconPath: '/modules/contrib/silverback_external_preview/icons/tablet.svg',
    },
    {
      label: __('Laptop'),
      width: 1366,
      height: 786,
      iconPath: '/modules/contrib/silverback_external_preview/icons/laptop.svg',
    },
    {
      label: __('Desktop'),
      width: 1920,
      height: 1080,
      iconPath:
        '/modules/contrib/silverback_external_preview/icons/desktop.svg',
    },
    {
      label: __('Full'),
      width: -1,
      height: -1,
      iconPath: '/modules/contrib/silverback_external_preview/icons/full.svg',
    },
  ];

  return (
    <PluginSidebar
      name={'drupal-preview-sidebar'}
      title={__('Preview')}
      icon={'welcome-view-site'}
      isPinnable={true}
      className={'drupal-preview-sidebar'}
    >
      <div className={'drupal-preview-sidebar--header'}>
        {previewWindows.map((previewWindow) => {
          const windowFeatures =
            previewWindow.width !== -1 && previewWindow.height !== -1
              ? `resizable,height=${previewWindow.height},width=${previewWindow.width}`
              : `resizable,height=${screen.height},width=${screen.width}`;
          return (
            <Button
              isPrimary={true}
              target={'_blank'}
              onClick={(e: any) => {
                e.preventDefault();
                window.open(
                  drupalSettings.preview.previewUrl,
                  previewWindow.label,
                  windowFeatures,
                );
              }}
            >
              {previewWindow.label}
            </Button>
          );
        })}
      </div>
      <div className={'drupal-preview-sidebar--iframe-wrapper'}>
        <iframe
          width="100%"
          height="800px"
          src={drupalSettings.preview.previewUrl}
        ></iframe>
      </div>
    </PluginSidebar>
  );
};

registerPlugin('drupal-preview-sidebar', { render: PreviewSidebar });
