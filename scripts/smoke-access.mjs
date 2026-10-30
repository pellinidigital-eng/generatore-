import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = 32147;
const base = `http://127.0.0.1:${port}`;
const secret = "local-smoke-test-only-not-a-production-secret";
const toolId = "social-content-generator";
const productId = 999; // Test fixture ONLY; no WordPress product created.

const env = {
  ...process.env,
  NEXT_TELEMETRY_DISABLED: "1",
  PELLINIDIGITAL_TOOL_ACCESS_SECRET: secret,
  PELLINIDIGITAL_TOOL_ACCESS_KEY_ID: "smoke-key",
  PELLINIDIGITAL_TOKEN_ISSUER: "https://pellinidigital.it",
  PELLINIDIGITAL_TOOL_ID: toolId,
  PELLINIDIGITAL_EDD_PRODUCT_ID: String(productId),
  SOCIAL_PRO_ENABLE_OPENAI_API: "false",
  OPENAI_API_KEY: ""
};

function makeToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: "JWT", alg: "HS256", kid: env.PELLINIDIGITAL_TOOL_ACCESS_KEY_ID };
  const payload = {
    iss: env.PELLINIDIGITAL_TOKEN_ISSUER,
    aud: toolId,
    tool_id: toolId,
    sub: "wp_user_smoke",
    edd_product_id: productId,
    iat: now,
    exp: now + 90,
    jti: "smoke-jti"
  };
  const input = [header, payload].map((part) => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".");
  return `${input}.${createHmac("sha256", secret).update(input).digest("base64url")}`;
}

async function request(path, options = {}) {
  return fetch(base + path, { redirect: "manual", ...options });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await request("/access-denied");
      if (response.status === 200) return;
    } catch {
      // Next server still starting.
    }
    await sleep(200);
  }
  throw new Error("Next server did not become ready");
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  env,
  stdio: ["ignore", "pipe", "pipe"]
});
let logs = "";
server.stdout.on("data", (chunk) => { logs += chunk.toString(); });
server.stderr.on("data", (chunk) => { logs += chunk.toString(); });

try {
  await waitForServer();

  const root = await request("/");
  assert.equal(root.status, 307, "Unauthenticated root must redirect");
  assert.match(root.headers.get("location") || "", /\/access-denied/);

  const api = await request("/api/generate-social", { method: "POST" });
  assert.equal(api.status, 307, "Unauthenticated API must redirect");
  assert.match(api.headers.get("location") || "", /\/access-denied/);

  const missing = await request("/access");
  assert.equal(missing.status, 303, "Missing token must be rejected");

  const invalid = await request("/access?token=invalid");
  assert.equal(invalid.status, 303, "Invalid token must be rejected");

  const login = await request(`/access?token=${encodeURIComponent(makeToken())}`);
  assert.equal(login.status, 303, "Valid signed token must create a session");
  const setCookie = login.headers.get("set-cookie") || "";
  assert.match(setCookie, /pd_social_tool_session=/);
  assert.match(setCookie, /httponly/i);
  const cookie = setCookie.split(";")[0];

  const protectedRoot = await request("/", { headers: { cookie } });
  assert.equal(protectedRoot.status, 200, "Valid session should access generator");

  const protectedApi = await request("/api/generate-social", {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({})
  });
  assert.equal(protectedApi.status, 404, "Dormant OpenAI API must be disabled by default");

  console.log("Social PRO HTTP smoke PASS: guest root/API blocked, invalid tokens rejected, signed session works, OpenAI route disabled.");
} catch (error) {
  console.error(logs.slice(-5000));
  throw error;
} finally {
  server.kill("SIGTERM");
}
