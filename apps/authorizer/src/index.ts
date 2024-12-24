import { authorizer } from '@openauthjs/openauth';
import { MemoryStorage } from '@openauthjs/openauth/storage/memory';
//import { PasswordAdapter } from '@openauthjs/openauth/adapter/password';
//import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { serve } from '@hono/node-server';
import { DrupalAdapter } from './drupal.js';
import { subjects } from './subjects.js';

const app = authorizer({
  subjects,
  // @todo replace storage.
  storage: MemoryStorage({
    persist: './persist.json',
  }),
  providers: {
    // @todo configure with env vars.
    drupal: DrupalAdapter({
      domain: 'http://127.0.0.1:8888',
      clientID: 'website',
      clientSecret: 'website',
      scopes: ['editor'],
    }),
    // Password adapter as an example.
    // password: PasswordAdapter(
    //   PasswordUI({
    //     sendCode: async (email, code) => {
    //       console.log(email, code);
    //     },
    //   }),
    // ),
  },
  success: async (ctx, value) => {
    if (value.provider === 'drupal') {
      console.log('Success Drupal', ctx, value);
      return ctx.subject('user', {
        email: value.email,
      });
    }
    // Password adapter as an example.
    // if (value.provider === 'password') {
    //   return ctx.subject('user', {
    //     email: value.email,
    //   });
    // }
    throw new Error('Invalid provider');
  },
});

serve(app);
