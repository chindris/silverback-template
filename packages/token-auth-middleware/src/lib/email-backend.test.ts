import { describe, expect, it, vi } from 'vitest';

import { EmailBackend } from './email-backend';

const delivery = vi.fn();

class MockedEmailBackend extends EmailBackend {
  async deliver(payload: { email: string }, link: string): Promise<void> {
    const info = await this.getInfo(payload);
    delivery(info?.email, info?.name, link);
  }
}

describe('EmailBackend', () => {
  const backend = new MockedEmailBackend({
    'bob@amazeelabs.dev': 'Bob',
    'alice@amazeelabs.dev': 'Alice',
    '*@amazeelabs.com': '*',
  });

  it('returns undefined for an unknown email', async () => {
    expect(
      await backend.getInfo({ email: 'frank@amazeelabs.dev' }),
    ).toBeUndefined();
  });

  it('returns the name for a known email', async () => {
    expect(await backend.getInfo({ email: 'bob@amazeelabs.dev' })).toEqual({
      email: 'bob@amazeelabs.dev',
      name: 'Bob',
    });
  });

  it('returns the wildcard for a known domain', async () => {
    expect(await backend.getInfo({ email: 'hillary@amazeelabs.com' })).toEqual({
      email: 'hillary@amazeelabs.com',
      name: 'hillary',
    });
  });
});
