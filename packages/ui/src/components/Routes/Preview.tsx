'use client';
import {
  OperationVariables,
  Url,
  Locale,
  PreviewDrupalPageQuery,
  useLocation,
} from '@custom/schema';
import React from 'react';

import { clear, useOperation } from '../../utils/operation';
import { PageDisplay } from '../Organisms/PageDisplay';
import { useIntl } from 'react-intl';

function usePreviewParameters(): OperationVariables<
  typeof PreviewDrupalPageQuery
> {
  const [location] = useLocation();

  const nid = location.searchParams.get('nid');
  const rid = location.searchParams.get('rid');
  const lang = location.searchParams.get('lang');
  const previewUserId = location.searchParams.get('preview_user_id');
  const previewAccessToken = location.searchParams.get('preview_access_token');
  return {
    id: nid || '',
    rid: rid || '',
    locale: lang || 'en',
    preview_user_id: previewUserId || '',
    preview_access_token: previewAccessToken || '',
  };
}

export function usePreviewRefresh() {
  const params = usePreviewParameters();
  return (input: {
    entity_type_id?: string;
    entity_id?: string;
    langcode?: string;
    preview_user_id?: string;
    preview_access_token?: string;
  }) => {
    if (
      // TODO: Extend for non-node entities?
      input.entity_type_id === 'node' &&
      input.entity_id === params.id &&
      input.langcode === params.locale
    ) {
      clear(PreviewDrupalPageQuery, params);
    }
  };
}

export function Preview() {
  const { data } = useOperation(PreviewDrupalPageQuery, usePreviewParameters());
  const intl = useIntl();
  if (data?.preview) {
    return <PageDisplay {...data.preview} />;
  } else {
    // @todo: load this content from Drupal settings, create a ForbiddenPage component.
    const data403 = {
      preview: {
        title: '403 Forbidden',
        locale: 'en' as Locale,
        translations: [],
        path: '/403' as Url,
        content: [
          {
            __typename: 'BlockMarkup',
            markup: `<p>${intl.formatMessage({
              defaultMessage:
                'You do not have access to this page. Your access token might have expired.',
              id: 'e7yFQY',
            })}</p>`,
          },
        ] as Exclude<PreviewDrupalPageQuery['preview'], undefined>['content'],
      },
    };
    return <PageDisplay {...data403.preview} />;
  }
}
