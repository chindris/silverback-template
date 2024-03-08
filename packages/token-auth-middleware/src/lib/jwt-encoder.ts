import { b64utoutf8, KJUR } from 'jsrsasign';

import {
  Payload,
  TokenEncoderInterface,
  TokenExpiredError,
  TokenInvalidError,
} from './handler.js';

/**
 * Simplified interface for creating and validating JSON Web Tokens.
 */
export class JwtEncoder<TPayload extends Payload>
  implements TokenEncoderInterface<TPayload>
{
  constructor(protected secret: string) {}

  async create(payload: TPayload, lifetime?: number) {
    const header = { alg: 'HS256', typ: 'JWT' };
    return KJUR.jws.JWS.sign(
      'HS256',
      JSON.stringify(header),
      JSON.stringify({
        ...payload,
        exp: lifetime ? new Date().getTime() / 1000 + lifetime : undefined,
      }),
      this.secret,
    );
  }

  async validate(token: string) {
    const isValid = KJUR.jws.JWS.verifyJWT(token, this.secret, {
      alg: ['HS256'],
    });
    const { exp, ...payload } =
      JSON.parse(b64utoutf8(token.split('.')[1])) || {};
    if (exp && exp < new Date().getTime() / 1000) {
      throw new TokenExpiredError();
    }
    if (!isValid) {
      throw new TokenInvalidError();
    }
    return payload;
  }
}
