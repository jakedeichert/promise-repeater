export const repeatPromise = (
  promiseFunc: () => Promise<any>,
  maxAttempts: number,
  sleepMs: number = 0
): any => {
  const attempt = (attemptCount: number) => {
    return new Promise((resolve, reject) => {
      promiseFunc()
        .then(result => {
          resolve(result);
        })
        .catch(rejectedValue => {
          if (attemptCount === maxAttempts) {
            return reject(rejectedValue);
          }
          // Failed attempt. Try again after sleepMs
          setTimeout(() => {
            resolve(attempt(attemptCount + 1));
          }, sleepMs);
        });
    });
  };
  return attempt(1);
};
