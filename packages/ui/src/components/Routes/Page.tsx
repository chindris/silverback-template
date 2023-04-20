import { PageFragment, Image } from '@custom/schema';
import React from 'react';

import { BlockImage } from '../Organisms/PageContent/BlockImage';
import { BlockText } from '../Organisms/PageContent/BlockText';

export function Page(props: { page: PageFragment }) {
  return (
    <div>
      {props.page.hero ? (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          {props.page.hero.image ? (
            <Image
              alt={props.page.hero.image.alt}
              source={props.page.hero.image.source}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
          ) : null}
          <div
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {props.page.hero.headline}
              </h2>
              {props.page.hero.lead ? (
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  {props.page.hero.lead}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      <div className="bg-white py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mt-10">
            {props.page?.content?.map((block, index) => {
              switch (block?.__typename) {
                case 'BlockImage':
                  return <BlockImage key={index} {...block} />;
                case 'BlockText':
                  return <BlockText key={index} {...block} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
