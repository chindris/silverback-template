import gql from 'noop-tag';
import { describe, expect, it } from 'vitest';

import { fetch } from '../lib.js';

describe('create inquiry', () => {
  it('creates a new inquiry using a graphql mutation', async () => {
    const result = await fetch(gql`
      mutation {
        createWebformSubmission(
          webformId: "inquiry"
          submittedData: "{\\"name\\": \\"John Doe\\", \\"email\\": \\"john@doe.com\\", \\"question\\": \\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna?\\", \\"subject\\": \\"Lorem ipsum\\"}"
        ) {
          errors {
            key
            field
            message
          }
          submission
        }
      }
    `);
    const submission = JSON.parse(
      result.data.createWebformSubmission.submission,
    );
    expect(submission.email).toEqual('john@doe.com');
    expect(submission.question).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pretium aliquam magna?',
    );
    expect(submission.name).toEqual('John Doe');
    expect(submission.subject).toEqual('Lorem ipsum');
    expect(result.data.createWebformSubmission.errors).toBeNull();
  });

  it('tries to create a new inquiry with an invalid e-mail address', async () => {
    const result = await fetch(gql`
      mutation {
        createWebformSubmission(
          webformId: "inquiry"
          submittedData: "{\\"name\\": \\"Jane\\",\\"email\\": \\"invalid_email\\",\\"question\\": \\"Is this a test?\\",\\"subject\\": \\"Test subject\\"}"
        ) {
          errors {
            key
            field
            message
          }
          submission
        }
      }
    `);
    expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "createWebformSubmission": {
          "errors": [
            {
              "field": "email",
              "key": "invalid_field_email",
              "message": "The email address <em class="placeholder">invalid_email</em> is not valid. Use the format user@example.com.",
            },
          ],
          "submission": null,
        },
      },
    }
  `);
  });
});
