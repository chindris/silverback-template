import { Image, Link, PageFragment } from '@custom/schema';
import React from 'react';

import { BlockForm } from './PageContent/BlockForm';

export function PageHero(props: NonNullable<PageFragment['hero']>) {
  return props.formUrl ? <FormHero {...props} /> : <DefaultHero {...props} />;
}

function DefaultHero(props: NonNullable<PageFragment['hero']>) {
  return (
    <section className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      {props.image ? (
        <Image
          alt={props.image.alt}
          source={props.image.source}
          priority={true}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          data-test-id={'hero-image'}
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
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {props.headline}
          </h1>
          {props.lead ? (
            <p className="mt-6 text-lg leading-8 text-gray-300">{props.lead}</p>
          ) : null}
          {props.ctaText && props.ctaUrl ? (
            <Link
              href={props.ctaUrl}
              className={
                'mt-7 inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              }
            >
              {props.ctaText}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FormHero(props: NonNullable<PageFragment['hero']>) {
  return (
    <section>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24">
        {props.image ? (
          <Image
            alt={props.image.alt}
            source={props.image.source}
            priority={true}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            data-test-id={'hero-image'}
          />
        ) : null}

        <div className="px-4 lg:pt-24 pt-8 pb-72 lg:pb-80 mx-auto max-w-screen-sm text-center lg:px-6 ">
          <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
            {props.headline}
          </h1>
          {props.lead ? (
            <p className="mt-6 text-lg leading-4 text-gray-300">{props.lead}</p>
          ) : null}
          {props.ctaText && props.ctaUrl ? (
            <Link
              href={props.ctaUrl}
              className={
                'mt-7 inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              }
            >
              {props.ctaText}
            </Link>
          ) : null}
        </div>
      </div>
      {props.formUrl ? (
        <div className="px-4 mx-auto -mt-[22rem] lg:-mt-96 max-w-screen-xl lg:px-6 relative">
          <div className="p-6 mx-auto max-w-screen-md bg-white rounded-lg border border-gray-200 shadow-sm">
            <BlockForm url={props.formUrl} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
