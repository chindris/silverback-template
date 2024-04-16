import { Image, Link, PageFragment } from '@custom/schema';
import React from 'react';

import { BlockForm } from './PageContent/BlockForm';

export function PageHero(props: NonNullable<PageFragment['hero']>) {
  return props.formUrl ? (
    <FormHero {...props} />
  ) : props.image ? (
    <DefaultHero {...props} />
  ) : (
    <NoImageHero {...props} />
  );
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="max-w-xl text-5xl font-extrabold tracking-tight leading-tight text-white">
            {props.headline}
          </h1>
          {props.lead ? (
            <p className="mt-6 text-lg leading-8 text-gray-300">{props.lead}</p>
          ) : null}
          {props.ctaText && props.ctaUrl ? (
            <Link
              href={props.ctaUrl}
              className="mt-7 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
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
          <h1 className="text-4xl tracking-tight font-extrabold text-white">
            {props.headline}
          </h1>
          {props.lead ? (
            <p className="mt-6 text-lg leading-4 text-gray-300">{props.lead}</p>
          ) : null}
          {props.ctaText && props.ctaUrl ? (
            <Link
              href={props.ctaUrl}
              className="mt-7 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {props.ctaText}
            </Link>
          ) : null}
        </div>
      </div>
      {props.formUrl ? (
        <div className="px-4 mx-auto mt-[-22rem] lg:-mt-96 max-w-screen-xl lg:px-6 relative">
          <div className="p-6 mx-auto max-w-screen-md bg-white rounded-lg border border-gray-200 shadow-sm">
            <BlockForm url={props.formUrl} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NoImageHero(props: NonNullable<PageFragment['hero']>) {
  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-20 sm:pb-12 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-2xl lg:mx-0">
          <h1 className="max-w-xl text-5xl font-extrabold tracking-tight leading-tight">
            {props.headline}
          </h1>
          {props.lead ? (
            <p className="mt-6 text-lg leading-8 text-gray-500">{props.lead}</p>
          ) : null}
          {props.ctaText && props.ctaUrl ? (
            <Link
              href={props.ctaUrl}
              className="mt-7 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {props.ctaText}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
