export interface IpLocationProvider {
    name: string;
    url: string;
}

function coordinate(value: unknown, limit: number): number | null {
    if (typeof value !== "number" && typeof value !== "string") return null;
    if (typeof value === "string" && !value.trim()) return null;
    const number = Number(value);
    return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
}

/** Providers return numeric coordinates or decimal strings (GeoJS). */
function parseLocation(data: unknown) {
    if (!data || typeof data !== "object") return null;
    const payload = data as Record<string, unknown>;
    if (payload.success === false || payload.error) return null;
    const lat = coordinate(payload.latitude, 90);
    const lon = coordinate(payload.longitude, 180);
    const city = [payload.city, payload.region].find(
        (value): value is string => typeof value === "string" && !!value.trim(),
    );
    if (lat === null || lon === null || !city) return null;
    return { lat, lon, city: city.trim(), source: "ip" as const };
}

/** Fail over without treating HTTP errors, challenge HTML or invalid data as a location. */
export async function fetchIpLocation(
    providers: readonly IpLocationProvider[],
    timeoutMs: number,
    fetcher: typeof fetch = fetch,
) {
    for (const provider of providers) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetcher(provider.url, {
                signal: controller.signal,
                credentials: "omit",
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            if (!response.headers.get("content-type")?.toLowerCase().includes("application/json")) {
                throw new Error("Expected JSON response");
            }
            const location = parseLocation(await response.json());
            if (!location) throw new Error("Invalid location response");
            return location;
        } catch (error) {
            // Log only provider and failure reason, never returned IP/profile data.
            console.warn(`[Location] ${provider.name}: ${error instanceof Error ? error.message : "Request failed"}`);
        } finally {
            clearTimeout(timeout);
        }
    }
    return null;
}
