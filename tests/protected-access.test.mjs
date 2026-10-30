import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  ACCESS_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  createSessionCookieValue,
  verifySessionCookie,
  verifyWordPressAccessToken
} from "../lib/protected-access.ts";

const secret = "local-test-secret-do-not-use-in-production";
const keyId = "test-key";
const issuer = "https://pellinidigital.it";
const toolId = "social-content-generator";
const productId = 999; // Test fixture ONLY: never use as an EDD product ID.

function configure() {
  process.env.PELLINIDIGITAL_TOOL_ACCESS_SECRET = secret;
  process.env.PELLINIDIGITAL_TOOL_ACCESS_KEY_ID = keyId;
  process.env.PELLINIDIGITAL_TOKEN_ISSUER = issuer;
  process.env.PELLINIDIGITAL_TOOL_ID = toolId;
  process.env.PELLINIDIGITAL_EDD_PRODUCT_ID = String(productId);
}

function token(payload, header = { typ: "JWT", alg: "HS256", kid: keyId }) {
  const base = [header, payload].map((part) => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".");
  const signature = createHmac("sha256", secret).update(base).digest("base64url");
  return `${base}.${signature}`;
}

function claims(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    iss: issuer,
    aud: toolId,
    tool_id: toolId,
    sub: "wp_user_pseudonymous",
    edd_product_id: productId,
    iat: now,
    exp: now + 90,
    jti: "test-jti",
    ...overrides
  };
}

test("signed WordPress token grants access only to the configured tool and EDD product", async () => {
  configure();
  assert.equal(ACCESS_COOKIE_NAME, "pd_social_tool_session");
  assert.equal(SESSION_TTL_SECONDS, 21600);
  const result = await verifyWordPressAccessToken(token(claims()));
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.toolId, toolId);
});

test("reject wrong product, audience, issuer, expiry, long-lived tokens and altered signature", async () => {
  configure();
  const now = Math.floor(Date.now() / 1000);
  for (const invalid of [
    claims({ edd_product_id: productId + 1 }),
    claims({ aud: "ugc-script-generator" }),
    claims({ tool_id: "ugc-script-generator" }),
    claims({ iss: "https://wrong.example" }),
    claims({ exp: now - 1 }),
    claims({ exp: now + 3600 }),
    claims({ iat: now + 3600 })
  ]) {
    assert.equal((await verifyWordPressAccessToken(token(invalid))).ok, false);
  }
  assert.equal((await verifyWordPressAccessToken(token(claims(), { alg: "none", kid: keyId }))).ok, false);
  const signed = token(claims());
  assert.equal((await verifyWordPressAccessToken(signed.slice(0, -1) + (signed.endsWith("A") ? "B" : "A"))).ok, false);
});

test("fail closed without complete configuration or with invalid EDD ID", async () => {
  configure();
  delete process.env.PELLINIDIGITAL_EDD_PRODUCT_ID;
  assert.equal((await verifyWordPressAccessToken(token(claims()))).ok, false);
  process.env.PELLINIDIGITAL_EDD_PRODUCT_ID = "not-an-id";
  assert.equal((await verifyWordPressAccessToken(token(claims()))).ok, false);
  configure();
  delete process.env.PELLINIDIGITAL_TOOL_ACCESS_SECRET;
  assert.equal((await verifyWordPressAccessToken(token(claims()))).ok, false);
  configure();
});

test("session cookie is signed and rejects tampering, expired and wrong-tool sessions", async () => {
  configure();
  const verified = await verifyWordPressAccessToken(token(claims()));
  assert.equal(verified.ok, true);
  if (!verified.ok) return;
  const cookie = await createSessionCookieValue(verified.value);
  assert.equal((await verifySessionCookie(cookie)).ok, true);
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: "test", tool_id: toolId, iat: now, exp: now + SESSION_TTL_SECONDS + 3600 };
  assert.equal((await verifySessionCookie(token(payload))).ok, false);
  assert.equal((await verifySessionCookie(token({ ...payload, tool_id: "ugc-script-generator", exp: now + 3600 }))).ok, false);
  assert.equal((await verifySessionCookie(cookie + "tamper")).ok, false);
});
