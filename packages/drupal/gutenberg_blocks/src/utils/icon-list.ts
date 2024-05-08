// @ts-ignore
const { t: __ } = Drupal;

const ICON_PATH = "/modules/custom/gutenberg_blocks/images/icons/";

// Icon list options
export const iconListOptions: { label: any, value: string }[] = [
  { label: __("Select an icon"), value: "" },
  { label: __("Email"), value: "EMAIL" },
  { label: __("Telephone"), value: "PHONE" },
  { label: __("Life Ring"), value: "LIFE-RING" }
];

// Icon image preview
export const iconImagePreview = (icon: string) => {
  switch (icon) {
    case "EMAIL":
      return ICON_PATH + "email.svg";
    case "PHONE":
      return ICON_PATH + "phone.svg";
    case "LIFE-RING":
      return ICON_PATH + "life-ring.svg";
    default:
      return "";
  }
}
