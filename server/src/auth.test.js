import bcrypt from 'bcrypt';
import { describe, expect, it } from 'vitest';

describe('authentication primitives', () => {
  it('stores passwords as bcrypt hashes that can be verified', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 4);
    expect(hash).not.toBe(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
    expect(await bcrypt.compare('wrong-password', hash)).toBe(false);
  });
});
