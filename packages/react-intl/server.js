import { createIntl } from 'react-intl';

let intl = null;

export function IntlProvider({ children, ...props }) {
  intl = createIntl(props);
  return children;
}

export function useIntl() {
  return intl;
}
