import { ImageSource } from '@amazeelabs/scalars';
import { Markup } from '@amazeelabs/scalars';
import { Url } from '@amazeelabs/scalars';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ImageSource: { input: ImageSource; output: ImageSource; }
  Markup: { input: Markup; output: Markup; }
  Url: { input: Url; output: Url; }
};

export type BlockForm = {
  url?: Maybe<Scalars['Url']['output']>;
};

export type BlockMarkup = {
  markup: Scalars['Markup']['output'];
};

export type BlockMedia = {
  caption?: Maybe<Scalars['Markup']['output']>;
  media?: Maybe<Media>;
};

export type ContentHubResult = {
  items: Array<Maybe<ContentHubResultItem>>;
  total: Scalars['Int']['output'];
};

/** Inteface for anything that can appear in the content hub. */
export type ContentHubResultItem = {
  path: Scalars['Url']['output'];
  teaserImage?: Maybe<MediaImage>;
  title: Scalars['String']['output'];
};

export type FooterNavigation = Navigation & {
  items: Array<Maybe<NavigationItem>>;
};

export type Hero = {
  headline: Scalars['String']['output'];
  image?: Maybe<MediaImage>;
  lead?: Maybe<Scalars['String']['output']>;
};

export const Locale = {
  De: 'de',
  En: 'en'
} as const;

export type Locale = typeof Locale[keyof typeof Locale];
export type MainNavigation = Navigation & {
  items: Array<Maybe<NavigationItem>>;
};

export type Media = MediaImage | MediaVideo;

export type MediaImage = {
  alt: Scalars['String']['output'];
  source: Scalars['ImageSource']['output'];
};


export type MediaImageSourceArgs = {
  height?: InputMaybe<Scalars['Int']['input']>;
  sizes?: InputMaybe<Array<Array<Scalars['Int']['input']>>>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type MediaVideo = {
  url: Scalars['Url']['output'];
};

export type MetaTag = {
  attributes: MetaTagAttributes;
  tag: Scalars['String']['output'];
};

export type MetaTagAttributes = {
  content?: Maybe<Scalars['String']['output']>;
  href?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  property?: Maybe<Scalars['String']['output']>;
  rel?: Maybe<Scalars['String']['output']>;
};

export type Navigation = {
  items: Array<Maybe<NavigationItem>>;
};

/**
 * A single navigation item. Can be available in multiple languages
 * and nested into a tree structure. The tree structure is not modeled
 * in the GraphQL schema since it does not allow recursive fragments. Instead
 * the consumer should use the `parent` field to traverse the tree.
 */
export type NavigationItem = {
  id: Scalars['ID']['output'];
  parent?: Maybe<Scalars['ID']['output']>;
  target: Scalars['Url']['output'];
  title: Scalars['String']['output'];
};

/** A generic page. */
export type Page = ContentHubResultItem & {
  content?: Maybe<Array<Maybe<PageContent>>>;
  hero?: Maybe<Hero>;
  locale: Locale;
  metaTags?: Maybe<Array<Maybe<MetaTag>>>;
  path: Scalars['Url']['output'];
  teaserImage?: Maybe<MediaImage>;
  title: Scalars['String']['output'];
};

export type PageContent = BlockForm | BlockMarkup | BlockMedia;

export type PaginationInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type Query = {
  contentHub: ContentHubResult;
  previewPage?: Maybe<Page>;
};


export type QueryContentHubArgs = {
  pagination: PaginationInput;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPreviewPageArgs = {
  id: Scalars['ID']['input'];
  locale: Scalars['String']['input'];
  rid?: InputMaybe<Scalars['ID']['input']>;
};

export type WebsiteSettings = {
  homePage?: Maybe<Page>;
  notFoundPage?: Maybe<Page>;
};

export type ContentHubResultItemFragment = { title: string, path: Url, teaserImage?: { alt: string, source: ImageSource } | undefined };

type Navigation_FooterNavigation_Fragment = { items: Array<{ id: string, parent?: string | undefined, title: string, target: Url } | undefined> };

type Navigation_MainNavigation_Fragment = { items: Array<{ id: string, parent?: string | undefined, title: string, target: Url } | undefined> };

export type NavigationFragment = Navigation_FooterNavigation_Fragment | Navigation_MainNavigation_Fragment;

export type NavigationItemFragment = { id: string, parent?: string | undefined, title: string, target: Url };

export type PageFragment = { title: string, hero?: { headline: string, lead?: string | undefined, image?: { source: ImageSource, alt: string } | undefined } | undefined, content?: Array<{ __typename: 'BlockForm', url?: Url | undefined } | { __typename: 'BlockMarkup', markup: Markup } | { __typename: 'BlockMedia', caption?: Markup | undefined, media?: { __typename: 'MediaImage', source: ImageSource, alt: string } | { __typename: 'MediaVideo', url: Url } | undefined } | undefined> | undefined, metaTags?: Array<{ tag: string, attributes: { name?: string | undefined, content?: string | undefined, property?: string | undefined, rel?: string | undefined, href?: string | undefined } } | undefined> | undefined };

export type BlockFormFragment = { url?: Url | undefined };

export type BlockMarkupFragment = { markup: Markup };

export type BlockMediaFragment = { caption?: Markup | undefined, media?: { __typename: 'MediaImage', source: ImageSource, alt: string } | { __typename: 'MediaVideo', url: Url } | undefined };

export type ContentHubQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  pagination: PaginationInput;
}>;


export type ContentHubQuery = { contentHub: { total: number, items: Array<{ title: string, path: Url, teaserImage?: { alt: string, source: ImageSource } | undefined } | undefined> } };

export type PreviewPageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  rid: Scalars['ID']['input'];
  locale: Scalars['String']['input'];
}>;


export type PreviewPageQuery = { previewPage?: { title: string, hero?: { headline: string, lead?: string | undefined, image?: { source: ImageSource, alt: string } | undefined } | undefined, content?: Array<{ __typename: 'BlockForm', url?: Url | undefined } | { __typename: 'BlockMarkup', markup: Markup } | { __typename: 'BlockMedia', caption?: Markup | undefined, media?: { __typename: 'MediaImage', source: ImageSource, alt: string } | { __typename: 'MediaVideo', url: Url } | undefined } | undefined> | undefined, metaTags?: Array<{ tag: string, attributes: { name?: string | undefined, content?: string | undefined, property?: string | undefined, rel?: string | undefined, href?: string | undefined } } | undefined> | undefined } | undefined };

declare const OperationId: unique symbol;

export type OperationId<
  TQueryResult extends any,
  TQueryVariables extends any,
> = string & {
  _opaque: typeof OperationId;
  ___query_result: TQueryResult;
  ___query_variables: TQueryVariables;
};

export type AnyOperationId = OperationId<any, any>;

export type OperationResult<TQueryID extends OperationId<any, any>> =
  TQueryID['___query_result'];

export type OperationVariables<TQueryID extends OperationId<any, any>> =
  TQueryID['___query_variables'];
export const ContentHubQuery = "ContentHub:dc2ff25fb78058045650a591d515020902a1d79052d137b2cc4e54c50b2ac16a" as OperationId<ContentHubQuery,ContentHubQueryVariables>;
export const PreviewPageQuery = "PreviewPage:725dde68e5a897f8a6c0b98d7cf4226a45a98650178564b6df863dbedbdbf37b" as OperationId<PreviewPageQuery,PreviewPageQueryVariables>;