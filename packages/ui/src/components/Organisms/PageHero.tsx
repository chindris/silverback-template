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
      <section className="default-hero container-page relative isolate h-[50rem] min-h-80 overflow-hidden bg-gray-900 pb-24 pt-12 lg:h-auto lg:min-h-[33rem]">
        {props.image ? (
          <>
            <Image
              alt={props.image.alt}
              source={props.image.landscape}
              priority={true}
              className="absolute inset-0 -z-10 hidden size-full object-cover lg:block"
              data-test-id={'hero-image'}
            />
            <Image
              alt={props.image.alt}
              source={props.image.portrait}
              priority={true}
              className="absolute inset-0 -z-10 block size-full object-cover lg:hidden"
              data-test-id={'hero-image'}
            />
          </>
        ) : null}
        <div className="container-content">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
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
                className="mt-7 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="-ml-1 mr-2 size-4"
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
              source={props.image.landscape}
              priority={true}
              className="absolute inset-0 size-full object-cover"
              data-test-id={'hero-image'}
            />
            <div className="absolute inset-0 size-full bg-black opacity-40" />
          </>
        ) : null}

        <div className="container-page relative px-4 pb-[22rem] text-center lg:px-6 lg:pb-96">
          <div className="mx-auto max-w-screen-xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
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
                className="mt-7 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="-ml-1 mr-2 size-4"
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
        <div className="relative mx-auto mt-[-22rem] max-w-screen-xl px-4 lg:-mt-96 lg:px-6">
          <div className="nested-container mx-auto max-w-[52rem] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
      <section className="container-page relative isolate overflow-hidden pt-12 sm:pt-20">
        <div className="container-content">
          <div className="container-text">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
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
                className="mt-5 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="-ml-1 mr-2 size-4"
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
