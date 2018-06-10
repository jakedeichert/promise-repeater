export const repeatPromise = (
  promiseToAttempt: () => Promise<any>,
  maxAttempts: number,
  sleepMs: number = 0
): any => {
  const attempt = (attemptCount: number) => {
    return new Promise((resolve, reject) => {
      promiseToAttempt()
        .then(result => {
          resolve(result);
        })
        .catch(() => {
          if (attemptCount === maxAttempts) {
            return reject('max attempts reached');
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
