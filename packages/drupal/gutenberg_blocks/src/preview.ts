(($, Drupal, once, drupalSettings) => {
  Drupal.behaviors.gutenbergBlocksPreview = {
    /* @ts-ignore */
    attach: function (context) {
      $(once('gutenbergBlocksPreview', '.gutenberg-full-editor', context)).each(
        function () {
          $('#edit-preview-link').on('click', function (e: Event) {
            e.preventDefault();

            const previewUrl = drupalSettings.preview.previewUrl;
            const previewSizes = [
              {
                label: Drupal.t('Mobile'),
                id: 'mobile',
                width: 375,
                height: 725,
                iconPath:
                  '/modules/contrib/silverback_external_preview/icons/mobile.svg',
              },
              {
                label: Drupal.t('Tablet'),
                id: 'tablet',
                width: 1024,
                height: 824,
                iconPath:
                  '/modules/contrib/silverback_external_preview/icons/tablet.svg',
              },
              {
                label: Drupal.t('Laptop'),
                id: 'laptop',
                width: 1366,
                height: 786,
                iconPath:
                  '/modules/contrib/silverback_external_preview/icons/laptop.svg',
              },
              {
                label: Drupal.t('Desktop'),
                id: 'desktop',
                width: 1920,
                height: 1080,
                iconPath:
                  '/modules/contrib/silverback_external_preview/icons/desktop.svg',
              },
              {
                label: Drupal.t('Full'),
                id: 'full',
                width: -1,
                height: -1,
                iconPath:
                  '/modules/contrib/silverback_external_preview/icons/full.svg',
              },
            ];

            let previewButtons = '';
            previewSizes.forEach((size) => {
              previewButtons += `
                <button
                  class="components-button is-primary drupal-preview-sidebar--button__${size.id}" 
                >${size.label}</button>`;
            });

            const previewSidebarMarkup = `
              <div class="interface-interface-skeleton__secondary-sidebar drupal-preview-sidebar" role="region" aria-label="Drupal preview" tabindex="-1">
                <div class="interface-complementary-area edit-post-sidebar">
                  <div class="components-panel__header interface-complementary-area-header__small">
                    <span class="interface-complementary-area-header__small-title">${Drupal.t('Preview')}</span>
                    <button type="button" class="components-button has-icon" aria-label="Close plugin">
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                        <path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="components-panel__header interface-complementary-area-header" tabindex="-1">
                    <strong>${Drupal.t('Preview')}</strong>
                    <button type="button" aria-pressed="true" aria-expanded="true" class="components-button interface-complementary-area__pin-unpin-item is-pressed has-icon" aria-label="Unpin from toolbar">
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                        <path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="drupal-preview-sidebar components-panel">
                    <div class="drupal-preview-sidebar--header">
                      ${previewButtons}
                    </div>
                    <div class="drupal-preview-sidebar--iframe-wrapper">
                      <iframe width="100%" height="800px" 
                        src="${previewUrl}">
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>`;

            const $previewSidebar = $('.drupal-preview-sidebar');
            if (!$previewSidebar.length) {
              $('.interface-interface-skeleton__body').prepend(
                previewSidebarMarkup,
              );
              $('.drupal-preview-sidebar .components-panel__header button').on(
                'click',
                function () {
                  $('.drupal-preview-sidebar').remove();
                },
              );
              previewSizes.forEach((size) => {
                $('.drupal-preview-sidebar--button__' + size.id).on(
                  'click',
                  function () {
                    const windowFeatures =
                      size.width !== -1 && size.height !== -1
                        ? `resizable,height=${size.height},width=${size.width}`
                        : `resizable,height=${screen.height},width=${screen.width}`;
                    window.open(previewUrl, 'preview', windowFeatures);
                  },
                );
              });
            } else {
              $('.drupal-preview-sidebar').remove();
            }
          });
        },
      );
    },
  };
  /* @ts-ignore */
})(jQuery, Drupal, once, drupalSettings);
