import assert from "node:assert/strict";
import { test } from "node:test";
// @ts-expect-error Node's type-stripping test runner requires the .ts extension.
import { fetchIpLocation } from "./ip-location.ts";

const providers = [
    { name: "primary", url: "https://primary.example/" },
    { name: "backup", url: "https://backup.example/" },
];
const changchun = { city: "Changchun", latitude: "43.88", longitude: "125.32" };

test("Cloudflare 403 challenge falls through to the backup provider", async () => {
    const calls: string[] = [];
    const fetcher: typeof fetch = async (url) => {
        calls.push(String(url));
        return calls.length === 1
            ? new Response("<html>challenge</html>", { status: 403, headers: { "content-type": "text/html" } })
            : Response.json(changchun);
    };
    assert.deepEqual(await fetchIpLocation(providers, 1000, fetcher), {
        city: "Changchun", lat: 43.88, lon: 125.32, source: "ip",
    });
    assert.deepEqual(calls, providers.map(provider => provider.url));
});

test("invalid and HTML responses are rejected; valid zero coordinates are accepted", async () => {
    for (const response of [
        () => new Response("<html>challenge</html>", { headers: { "content-type": "text/html" } }),
        () => Response.json({ ...changchun, success: false }),
        () => Response.json({ ...changchun, latitude: null }),
        () => Response.json({ ...changchun, latitude: "" }),
        () => Response.json({ ...changchun, latitude: 91 }),
        () => Response.json({ ...changchun, longitude: 181 }),
    ]) {
        assert.equal(await fetchIpLocation([providers[0]], 1000, async () => response()), null);
    }
    assert.deepEqual(await fetchIpLocation(providers, 1000, async () => Response.json({
        city: "Zero", latitude: 0, longitude: 0,
    })), { city: "Zero", lat: 0, lon: 0, source: "ip" });
});

test("a timed-out primary request is aborted before trying the backup", async () => {
    const fetcher: typeof fetch = async (url, init) => {
        if (url === providers[1].url) return Response.json(changchun);
        return new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new Error("Aborted")), { once: true });
        });
    };
    assert.equal((await fetchIpLocation(providers, 10, fetcher))?.city, "Changchun");
});

test("all providers failing returns null so the caller can use its configured fallback", async () => {
    assert.equal(await fetchIpLocation(providers, 1000, async () => {
        throw new Error("Network unavailable");
    }), null);
});
