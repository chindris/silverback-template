import {
  CreateSubmissionMutation,
  OperationExecutor,
  OperationResult,
} from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import React from 'react';

import { ContactForm } from './ContactForm';

type ContactFormExecutor = () => Promise<
  OperationResult<typeof CreateSubmissionMutation>
>;

export default {
  title: 'Components/Molecules/ContactForm',
  render: (args) => {
    return (
      <OperationExecutor id={CreateSubmissionMutation} executor={args.exec}>
        <ContactForm />
      </OperationExecutor>
    );
  },
} satisfies Meta<{ exec: ContactFormExecutor }>;

export const Empty = {} satisfies StoryObj<typeof ContactForm>;

export const FilledForm: StoryObj<typeof ContactForm> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByPlaceholderText('Name');
    await userEvent.type(nameInput, 'John doe', {
      delay: 5,
    });
    const emailInput = canvas.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'john@doe.com', {
      delay: 5,
    });
    const subjectInput = canvas.getByPlaceholderText('Subject');
    await userEvent.type(subjectInput, 'Lorem ipsum', {
      delay: 5,
    });
    const messageInput = canvas.getByPlaceholderText('Message');
    await userEvent.type(
      messageInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      {
        delay: 5,
      },
    );
  },
};

export const WithValidationErrors: StoryObj<{ exec: ContactFormExecutor }> = {
  args: {
    exec: async () => {
      return {
        createWebformSubmission: {
          errors: [
            {
              key: 'invalid_field_email',
              field: 'email',
              message:
                'The email address <em class="placeholder">invalid_mail</em> is not valid. Use the format user@example.com.',
            },
          ],
        },
      };
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByPlaceholderText('Name');
    await userEvent.type(nameInput, 'John doe', {
      delay: 5,
    });
    const emailInput = canvas.getByPlaceholderText('Email');
    await userEvent.type(emailInput, 'invalid_mail', {
      delay: 5,
    });
    const subjectInput = canvas.getByPlaceholderText('Subject');
    await userEvent.type(subjectInput, 'Lorem ipsum', {
      delay: 5,
    });
    const messageInput = canvas.getByPlaceholderText('Message');
    await userEvent.type(
      messageInput,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      {
        delay: 5,
      },
    );
    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  },
};

export const WithSuccessfulSubmission: StoryObj<{ exec: ContactFormExecutor }> =
  {
    args: {
      exec: async () => {
        return {
          createWebformSubmission: {
            error: null,
            submission: '{"submissionId": "1"}',
          },
        };
      },
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const nameInput = canvas.getByPlaceholderText('Name');
      await userEvent.type(nameInput, 'John doe', {
        delay: 5,
      });
      const emailInput = canvas.getByPlaceholderText('Email');
      await userEvent.type(emailInput, 'john@mail.com', {
        delay: 5,
      });
      const subjectInput = canvas.getByPlaceholderText('Subject');
      await userEvent.type(subjectInput, 'Lorem ipsum', {
        delay: 5,
      });
      const messageInput = canvas.getByPlaceholderText('Message');
      await userEvent.type(
        messageInput,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        {
          delay: 5,
        },
      );
      const submitButton = canvas.getByRole('button');
      await userEvent.click(submitButton);
    },
  };
