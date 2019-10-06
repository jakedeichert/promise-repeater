import { repeat } from '@src/index';
import * as mockTimers from '@test/utils/mockTimers';

beforeEach(() => {
    mockTimers.before();
});

afterEach(() => {
    mockTimers.after();
});

describe('repeatPromise', () => {
    test('resolves to the value of the promise', async () => {
        const promiseFunc = (): Promise<string> => {
            return new Promise((resolve): void => {
                resolve('RETURN_VALUE');
            });
        };
        const val = await repeat(promiseFunc).start();
        expect(val).toBe('RETURN_VALUE');
    });

    test('allows unlimited attempts', async () => {
        let counter = 0;
        const promiseFunc = async (): Promise<string> => {
            counter++;
            if (counter === 5) return 'RETURN_VALUE';
            throw 'FAILED';
        };
        const val = await repeat(promiseFunc)
            .unlimitedAttempts()
            .start();
        expect(val).toBe('RETURN_VALUE');
    });

    test(`rejects when there's no max attempts configured`, async () => {
        let rejectedValue = null;
        const promiseFunc = (): Promise<void> => {
            return new Promise((_, reject): void => {
                reject('FAILED');
            });
        };

        try {
            await repeat(promiseFunc).start();
        } catch (e) {
            rejectedValue = e;
        }
        expect(rejectedValue).toBe('FAILED');
    });

    test('rejects after the max attempts limit has been reached', async () => {
        let counter = 0;
        let rejectedValue = null;
        const promiseFunc = (): Promise<void> => {
            counter++;
            return new Promise((_, reject): void => {
                reject('FAILED');
            });
        };

        try {
            await repeat(promiseFunc)
                .maxAttempts(4)
                .start();
        } catch (e) {
            rejectedValue = e;
        }
        expect(rejectedValue).toBe('FAILED');
        expect(counter).toBe(4);
    });

    test('resolves if under the max attempt limit', async () => {
        let counter = 0;
        let err = null;
        let value = null;
        const promiseFunc = (): Promise<string> => {
            counter++;
            return new Promise((resolve, reject): void => {
                if (counter === 3) return resolve('RETURN_VALUE');
                reject('FAILED');
            });
        };

        try {
            value = await repeat(promiseFunc)
                .maxAttempts(4)
                .start();
        } catch (e) {
            err = e;
        }
        expect(err).toBeNull();
        expect(counter).toBe(3);
        expect(value).toBe('RETURN_VALUE');
    });

    test('obeys the configured delay between attempts', async () => {
        global.setTimeout = jest.fn((cb, ms) => {
            expect(ms).toBe(100);
            expect(cb).toEqual(expect.any(Function));
            cb();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;

        let counter = 0;
        const promiseFunc = async (): Promise<string> => {
            counter++;
            if (counter === 3) {
                return 'RETURN_VALUE';
            }
            throw 'FAILED';
        };

        const val = await repeat(promiseFunc)
            .maxAttempts(4)
            .delay(100)
            .start();
        expect(val).toBe('RETURN_VALUE');
        expect(global.setTimeout).toHaveBeenCalledTimes(2);
    });

    test(`doesn't use setTimeout if there's no delay configured`, async () => {
        global.setTimeout = jest.fn(cb => {
            cb();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;

        let counter = 0;
        const promiseFunc = async (): Promise<string> => {
            counter++;
            if (counter === 3) {
                return 'RETURN_VALUE';
            }
            throw 'FAILED';
        };

        const val = await repeat(promiseFunc)
            .maxAttempts(4)
            .start();
        expect(val).toBe('RETURN_VALUE');
        expect(global.setTimeout).toHaveBeenCalledTimes(0);
    });
});
