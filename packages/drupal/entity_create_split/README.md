# Entity Create Split

A Drupal module which exposes routes to split an entity create form into two parts:
- on the first step, only the required fields are presented. After submitting the form, a entity is already created
- the second step is actually just the entity edit form, containing all the other optional form fields.

To enable this feature, you must create a form mode with the machine name "split" and enable it on the bundle for which you want to have this feature.

## Special case for the Gutenberg editor

The Gutenberg editor does a lot of alterations on the create form. For this reason, it is better that the form alter hook of the gutenberg module to not run at all. This is not easy possible, so right now the easiest approach is to just patch the module. The patch is included in the _patches/gutenberg_ folder.

The functionality should also work without the patch, but the initial form will not look that nice.
