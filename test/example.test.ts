import { repeatPromise } from 'index';

describe('repeatPromise', () => {
  test('should resolve to the value of the promise', async () => {
    const promiseFunc = () => {
      return new Promise(resolve => {
        resolve('RETURN_VALUE');
      });
    };
    const val = await repeatPromise(promiseFunc, 1);
    expect(val).toBe('RETURN_VALUE');
  });

  test('should reject when max attempts have been reached', async () => {
    let rejectedValue = null;
    const promiseFunc = () => {
      return new Promise((_, reject) => {
        reject('FAILED');
      });
    };

    try {
      await repeatPromise(promiseFunc, 1);
    } catch (e) {
      rejectedValue = e;
    }
    expect(rejectedValue).toBe('FAILED');
  });

  test('should reject after the correct amount of max attempts', async () => {
    let counter = 0;
    let rejectedValue = null;
    const promiseFunc = () => {
      counter++;
      return new Promise((_, reject) => {
        reject('FAILED');
      });
    };

    try {
      await repeatPromise(promiseFunc, 4);
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
    const promiseFunc = () => {
      counter++;
      return new Promise((resolve, reject) => {
        if (counter === 3) return resolve('RETURN_VALUE');
        reject('FAILED');
      });
    };

    try {
      value = await repeatPromise(promiseFunc, 4);
    } catch (e) {
      err = e;
    }
    expect(err).toBeNull();
    expect(counter).toBe(3);
    expect(value).toBe('RETURN_VALUE');
  });
});
