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
              },
              {
                label: Drupal.t('Tablet'),
                id: 'tablet',
                width: 768,
                height: 1024,
              },
              {
                label: Drupal.t('Laptop'),
                id: 'laptop',
                width: 1366,
                height: 786,
              },
              {
                label: Drupal.t('Desktop'),
                id: 'desktop',
                width: 1920,
                height: 1080,
              },
            ];

            const previewButton = `<button class="components-button is-primary external-preview">${Drupal.t('Preview')} ↗</button>`;

            const getPreviewSelect = () => {
              let previewSelect = '<select class="external-preview">';
              previewSizes.forEach((size) => {
                const selectOption = `<option value="${size.id}">${size.label} (${size.width} x ${size.height})</option>`;
                previewSelect += selectOption;
              });
              previewSelect += '</select>';
              return previewSelect;
            };
            const previewSelect = getPreviewSelect();

            const shareButton = `<a 
              class="components-external-link components-button share-preview use-ajax" 
              href="${drupalSettings.preview.previewTokenUrl}"
              data-dialog-type="modal"
              data-dialog-options="{&quot;width&quot;:550,&quot;height&quot;:820}" 
              rel="external noreferrer noopener">
                ${Drupal.t('Share preview')}<span class="components-visually-hidden">${Drupal.t('(opens in a new tab)')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="components-external-link__icon css-6wogo1-StyledIcon etxm6pv0" role="img" aria-hidden="true" focusable="false">
                  <path d="M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z"></path>
                </svg>
            </a>`;

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
                      <div>${previewSelect} ${previewButton}</div>
                      <div>${shareButton}</div>
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

              const $previewButton = $('button.external-preview');
              $('select.external-preview')
                .on('change', function (event: Event) {
                  const selectedSize = $(event.target).val();
                  const size = previewSizes.find(
                    (size) => size.id === selectedSize,
                  );
                  if (!size) {
                    return;
                  }
                  $previewButton.data('windowTarget', size.id);
                  $previewButton.data('windowHeight', size.height);
                  $previewButton.data('windowWidth', size.width);
                })
                .trigger('change');
              $previewButton.on('click', function (event: Event) {
                const target = $(event.target);
                const windowWidth = target.data('windowWidth');
                const windowHeight = target.data('windowHeight');
                const windowTarget = target.data('windowTarget');
                const windowFeatures = `resizable,height=${windowHeight},width=${windowWidth}`;
                window.open(previewUrl, windowTarget, windowFeatures);
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
