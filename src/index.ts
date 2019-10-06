/* eslint-disable @typescript-eslint/no-explicit-any */
interface RepeatBuilder {
    maxAttempts(attempts: number): RepeatBuilder;
    delay(delayBetweenAttemptsMs: number): RepeatBuilder;
    start(): Promise<any>;
}

export function repeat(promiseFunc: () => Promise<any>): RepeatBuilder {
    const config = {
        maxAttempts: 0,
        delayBetweenAttemptsMs: 0,
    };

    const state = {
        attempts: 0,
    };

    const self: RepeatBuilder = {
        maxAttempts(attempts: number): RepeatBuilder {
            config.maxAttempts = attempts;
            return this;
        },
        delay(delayBetweenAttemptsMs: number): RepeatBuilder {
            config.delayBetweenAttemptsMs = delayBetweenAttemptsMs;
            return this;
        },
        start(): Promise<any> {
            return attempt();
        },
    };

    async function attempt(): Promise<any> {
        state.attempts++;
        let result;
        try {
            result = await promiseFunc();
        } catch (error) {
            if (state.attempts === config.maxAttempts) {
                throw error;
            }
            // Failed attempt. Delay and then try again.
            await sleep(config.delayBetweenAttemptsMs);
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
