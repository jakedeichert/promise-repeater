import { repeat } from '@src/index';
import * as mockTimers from '@test/utils/mockTimers';

beforeEach(() => {
    mockTimers.before();
});

afterEach(() => {
    mockTimers.after();
});

describe('repeatPromise', () => {
    test('should resolve to the value of the promise', async () => {
        const promiseFunc = (): Promise<string> => {
            return new Promise((resolve): void => {
                resolve('RETURN_VALUE');
            });
        };
        const val = await repeat(promiseFunc)
            .maxAttempts(1)
            .start();
        expect(val).toBe('RETURN_VALUE');
    });

    test('should reject when max attempts have been reached', async () => {
        let rejectedValue = null;
        const promiseFunc = (): Promise<void> => {
            return new Promise((_, reject): void => {
                reject('FAILED');
            });
        };

        try {
            await repeat(promiseFunc)
                .maxAttempts(1)
                .start();
        } catch (e) {
            rejectedValue = e;
        }
        expect(rejectedValue).toBe('FAILED');
    });

    test('should reject after the correct amount of max attempts', async () => {
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

    test('should resolve if under the max attempt limit', async () => {
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

    test('should obey the sleep timeout option', async () => {
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
});
