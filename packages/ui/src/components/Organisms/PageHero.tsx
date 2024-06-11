import { Image, Link, PageFragment } from '@custom/schema';
import React from 'react';

import { BreadCrumbs } from '../Molecules/Breadcrumbs';
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
    <>
      <section className="default-hero relative isolate overflow-hidden bg-gray-900 pt-12 pb-24 min-h-[20rem] lg:min-h-[33rem] container-page">
        {props.image ? (
          <Image
            alt={props.image.alt}
            source={props.image.source}
            priority={true}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            data-test-id={'hero-image'}
          />
        ) : null}
        <div className="container-content">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              {props.headline}
            </h1>
            {props.lead ? (
              <p className="mt-6 text-lg leading-8 text-gray-300">
                {props.lead}
              </p>
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
      <BreadCrumbs />
    </>
  );
}

function FormHero(props: NonNullable<PageFragment['hero']>) {
  return (
    <section>
      <div className="relative isolate overflow-hidden bg-gray-900 py-12 md:py-24">
        {props.image ? (
          <>
            <Image
              alt={props.image.alt}
              source={props.image.source}
              priority={true}
              className="absolute inset-0 h-full w-full object-cover"
              data-test-id={'hero-image'}
            />
            <div className="absolute inset-0 h-full w-full bg-black opacity-40" />
          </>
        ) : null}

        <div className="px-4 pb-[22rem] lg:pb-96 container-page text-center lg:px-6 relative">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-4xl tracking-tight font-extrabold text-white drop-shadow-md">
              {props.headline}
            </h1>
            {props.lead ? (
              <p className="mt-6 text-lg leading-4 text-gray-300">
                {props.lead}
              </p>
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
      </div>
      {props.formUrl ? (
        <div className="px-4 mx-auto mt-[-22rem] lg:-mt-96 max-w-screen-xl lg:px-6 relative">
          <div className="p-6 mx-auto max-w-[52rem] bg-white rounded-lg border border-gray-200 shadow-sm nested-container">
            <BlockForm url={props.formUrl} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NoImageHero(props: NonNullable<PageFragment['hero']>) {
  return (
    <>
      <BreadCrumbs />
      <section className="relative isolate overflow-hidden pt-12 sm:pt-20 container-page">
        <div className="container-content">
          <div className="container-text">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              {props.headline}
            </h1>
            {props.lead ? (
              <p className="mt-4 text-lg leading-8 text-gray-500">
                {props.lead}
              </p>
            ) : null}
            {props.ctaText && props.ctaUrl ? (
              <Link
                href={props.ctaUrl}
                className="mt-5 px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
    </>
  );
}
