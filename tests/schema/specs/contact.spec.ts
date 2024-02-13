import gql from 'noop-tag';
import { describe, expect, it } from "vitest";

import { fetch } from '../lib.js';

describe('create contact', () => {
  it ('creates a new contact using a graphql mutation', async () => {
    const result = await fetch(gql`
      mutation {
        createContact(contact: {name: "John Doe", email: "john@doe.com", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna.", subject: "Lorem ipsum"}) {
          errors {
            key
            field
            message
          }
          contact {
            name
            email
            message
            subject
          }
        }
      }
    `);
    expect(result).toMatchInlineSnapshot(`
      {
        "data": {
          "createContact": {
            "contact": {
              "email": "john@doe.com",
              "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna.",
              "name": "John Doe",
              "subject": "Lorem ipsum",
            },
            "errors": null,
          },
        },
      }
    `)
  })

  it ('tries to create a new contact with an invalid e-mail address', async() => {
    const result = await fetch(gql`
      mutation {
        createContact(contact: {name: "Jane", email: "invalid_email", message: "Test message.", subject: "Test subject"}) {
          errors {
            key
            field
            message
          }
          contact {
            name
            email
            message
            subject
          }
        }
      }
    `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "createContact": {
          "contact": null,
          "errors": [
            {
              "field": "email",
              "key": "email",
              "message": "The email address <em class=\"placeholder\">invalid_email</em> is not valid. Use the format user@example.com.",
            },
          ],
        },
      },
    }
  `)
  });
});
