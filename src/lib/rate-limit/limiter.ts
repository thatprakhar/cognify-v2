interface RateLimitInfo {
    hourlyCount: number;
    dailyCount: number;
    lastResetHour: number;
    lastResetDay: number;
}

const rateLimits = new Map<string, RateLimitInfo>();

export async function checkRateLimit(userId: string): Promise<{ success: boolean; error?: string }> {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDate();

    let info = rateLimits.get(userId);

    if (!info) {
        info = { hourlyCount: 0, dailyCount: 0, lastResetHour: currentHour, lastResetDay: currentDay };
        rateLimits.set(userId, info);
    }

    if (info.lastResetHour !== currentHour) {
        info.hourlyCount = 0;
        info.lastResetHour = currentHour;
    }

    if (info.lastResetDay !== currentDay) {
        info.dailyCount = 0;
        info.lastResetDay = currentDay;
    }

    if (info.hourlyCount >= 20) {
        return { success: false, error: "Hourly rate limit exceeded (20/hour limit)." };
    }

    if (info.dailyCount >= 100) {
        return { success: false, error: "Daily rate limit exceeded (100/day limit)." };
    }

    info.hourlyCount++;
    info.dailyCount++;

    return { success: true };
}
