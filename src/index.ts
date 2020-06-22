interface RepeatBuilder<T> {
    maxAttempts(attempts: number): RepeatBuilder<T>;
    unlimitedAttempts(): RepeatBuilder<T>;
    delay(delayBetweenAttemptsMs: number): RepeatBuilder<T>;
    start(): Promise<T>;
}

export function repeat<T>(promiseFunc: () => Promise<T>): RepeatBuilder<T> {
    const config = {
        maxAttempts: 1,
        delayBetweenAttemptsMs: 0,
    };

    const state = {
        attempts: 0,
    };

    const self: RepeatBuilder<T> = {
        maxAttempts(attempts: number): RepeatBuilder<T> {
            config.maxAttempts = attempts;
            return this;
        },
        unlimitedAttempts(): RepeatBuilder<T> {
            config.maxAttempts = Infinity;
            return this;
        },
        delay(delayBetweenAttemptsMs: number): RepeatBuilder<T> {
            config.delayBetweenAttemptsMs = delayBetweenAttemptsMs;
            return this;
        },
        start(): Promise<T> {
            return attempt();
        },
    };

    async function attempt(): Promise<T> {
        state.attempts++;
        let result;
        try {
            result = await promiseFunc();
        } catch (error) {
            if (state.attempts === config.maxAttempts) {
                throw error;
            }
            // Failed attempt. Delay and then try again.
            if (config.delayBetweenAttemptsMs) {
                await sleep(config.delayBetweenAttemptsMs);
            }
            result = await attempt();
        }
        return result;
    }
    return self;
}

function sleep(timeoutMs: number): Promise<void> {
    return new Promise((resolve): void => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
}
