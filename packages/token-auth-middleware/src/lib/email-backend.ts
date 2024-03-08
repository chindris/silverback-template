import type { AuthenticationBackendInterface } from './handler.ts';

export abstract class EmailBackend
  implements
    AuthenticationBackendInterface<
      { email: string },
      { email: string; name: string }
    >
{
  constructor(protected users: Record<string, string>) {}

  async getInfo(
    payload: Partial<{ email: string }>,
  ): Promise<{ email: string; name: string } | undefined> {
    const email = payload.email;
    if (!email) {
      return;
    }
    if (email && this.users[email]) {
      return { email, name: this.users[email] };
    }
    const [name, host] = email.split('@');
    const wildcard = `*@${host}`;
    if (this.users[wildcard]) {
      return { email, name };
    }
  }
  abstract deliver(payload: { email: string }, link: string): Promise<void>;
}
