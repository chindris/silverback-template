import { Html, Markup } from '@custom/schema';
import React from 'react';

// TODO: Style, add stories.

export function Messages(props: { messages: Array<string> }) {
  return <div>{buildMessages(props.messages)}</div>;
}

export const buildMessages = (messages: Array<string>) => (
  <>
    {messages.map((message, index) => (
      <Html key={index} markup={message as Markup} />
    ))}
  </>
);

export const storeMessages = (messages: Array<string>): void => {
  localStorage.setItem('messages', JSON.stringify(messages));
};

export const readMessages = (): Array<string> => {
  const serialized = localStorage.getItem('messages');
  localStorage.removeItem('messages');
  if (serialized) {
    try {
      const messages = JSON.parse(serialized);
      if (
        Array.isArray(messages) &&
        messages.every((message) => typeof message === 'string')
      ) {
        return messages;
      }
    } catch (e) {
      return [];
    }
  }
  return [];
};
