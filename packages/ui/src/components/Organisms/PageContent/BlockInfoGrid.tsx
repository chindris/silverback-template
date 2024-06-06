import { BlockInfoGridFragment, InfoGridIcon } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../../utils/isTruthy';
import { BlockCta } from './BlockCta';
import { BlockMarkup } from './BlockMarkup';

export function BlockInfoGrid(props: BlockInfoGridFragment) {
  return (
    <div className="container-page my-12 md:my-24">
      <div className="container-content">
        <div
          className={
            'flex flex-col md:flex-row flex-wrap justify-center gap-12 items-center md:items-start'
          }
        >
          {props.gridItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-start gap-4 px-3 md:px-4 text-center md:w-[calc((100%-3rem)/2)] lg:w-[calc((100%-6rem)/3)]"
            >
              {item?.icon && iconMap[item?.icon]}
              <div className="flex flex-col items-center justify-center gap-3">
                {item?.infoGridContent?.filter(isTruthy).map((block, index) => {
                  switch (block?.__typename) {
                    case 'BlockCta':
                      return (
                        <div className="nested-container w-fit mx-auto">
                          <BlockCta key={index} {...block} />
                        </div>
                      );
                    case 'BlockMarkup':
                      return (
                        <div className="nested-container *:m-0 consistent-margin">
                          <BlockMarkup key={index} {...block} />
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MailIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" rx="8" fill="#F3F4F6" />
    <path
      d="M12.8076 22.1216L32.0004 31.7168L51.1932 22.1216C51.1222 20.8986 50.5862 19.7491 49.6952 18.9085C48.8041 18.0679 47.6254 17.5998 46.4004 17.6H17.6004C16.3754 17.5998 15.1967 18.0679 14.3056 18.9085C13.4146 19.7491 12.8787 20.8986 12.8076 22.1216Z"
      fill="#6B7280"
    />
    <path
      d="M51.1998 27.4832L31.9998 37.0832L12.7998 27.4832V41.6C12.7998 42.873 13.3055 44.0939 14.2057 44.9941C15.1059 45.8942 16.3268 46.4 17.5998 46.4H46.3998C47.6728 46.4 48.8937 45.8942 49.7939 44.9941C50.6941 44.0939 51.1998 42.873 51.1998 41.6V27.4832Z"
      fill="#6B7280"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" rx="8" fill="#F3F4F6" />
    <path
      d="M12.7998 15.2C12.7998 14.5635 13.0527 13.9531 13.5027 13.503C13.9528 13.0529 14.5633 12.8 15.1998 12.8H20.367C20.9351 12.8003 21.4847 13.0021 21.918 13.3695C22.3513 13.7369 22.6402 14.246 22.7334 14.8064L24.5094 25.4504C24.5943 25.9574 24.5141 26.4781 24.2808 26.9361C24.0475 27.3941 23.6734 27.7651 23.2134 27.9945L19.4982 29.8496C20.8305 33.1512 22.8146 36.1503 25.3321 38.6678C27.8495 41.1853 30.8486 43.1694 34.1502 44.5016L36.0078 40.7865C36.2371 40.3269 36.6077 39.9531 37.0651 39.7198C37.5226 39.4865 38.0429 39.4061 38.5494 39.4904L49.1934 41.2665C49.7538 41.3596 50.263 41.6486 50.6304 42.0819C50.9978 42.5152 51.1995 43.0648 51.1998 43.6329V48.8C51.1998 49.4366 50.947 50.047 50.4969 50.4971C50.0468 50.9472 49.4363 51.2001 48.7998 51.2001H43.9998C26.7678 51.2001 12.7998 37.232 12.7998 20V15.2Z"
      fill="#6B7280"
    />
  </svg>
);

const LifeRing = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" rx="8" fill="#F3F4F6" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M51.1998 32C51.1998 37.0922 49.177 41.9758 45.5763 45.5765C41.9756 49.1772 37.092 51.2001 31.9998 51.2001C26.9076 51.2001 22.0241 49.1772 18.4234 45.5765C14.8227 41.9758 12.7998 37.0922 12.7998 32C12.7998 26.9079 14.8227 22.0243 18.4234 18.4236C22.0241 14.8229 26.9076 12.8 31.9998 12.8C37.092 12.8 41.9756 14.8229 45.5763 18.4236C49.177 22.0243 51.1998 26.9079 51.1998 32ZM46.3998 32C46.3998 34.3832 45.8214 36.6296 44.7966 38.6096L41.139 34.9496C41.6867 33.2545 41.7515 31.4404 41.3262 29.7104L45.075 25.9616C45.9246 27.7977 46.3998 29.84 46.3998 32ZM34.0038 41.3913L37.7958 45.1833C35.9694 45.9874 33.9954 46.4018 31.9998 46.4001C29.9146 46.4026 27.854 45.9505 25.9614 45.0752L29.7102 41.3264C31.1182 41.6715 32.586 41.6936 34.0038 41.3913ZM22.779 34.6808C22.3067 33.0546 22.2728 31.3324 22.6806 29.6888L22.4886 29.8808L18.8166 26.2016C18.0121 28.0288 17.5977 30.0037 17.5998 32C17.5998 34.2896 18.135 36.4544 19.0854 38.3768L22.7814 34.6808H22.779ZM25.3902 19.2008C27.4331 18.1449 29.7001 17.5958 31.9998 17.6C34.2894 17.6 36.4542 18.1352 38.3766 19.0856L34.6806 22.7816C32.838 22.245 30.8769 22.2725 29.0502 22.8608L25.3902 19.2032V19.2008ZM36.7998 32C36.7998 33.2731 36.2941 34.494 35.3939 35.3942C34.4937 36.2943 33.2728 36.8 31.9998 36.8C30.7268 36.8 29.5059 36.2943 28.6057 35.3942C27.7055 34.494 27.1998 33.2731 27.1998 32C27.1998 30.727 27.7055 29.5061 28.6057 28.6059C29.5059 27.7058 30.7268 27.2 31.9998 27.2C33.2728 27.2 34.4937 27.7058 35.3939 28.6059C36.2941 29.5061 36.7998 30.727 36.7998 32Z"
      fill="#6B7280"
    />
  </svg>
);

const iconMap = {
  [InfoGridIcon.Email]: <MailIcon />,
  [InfoGridIcon.Phone]: <PhoneIcon />,
  [InfoGridIcon.LifeRing]: <LifeRing />,
  [InfoGridIcon.None]: null,
} as const;
