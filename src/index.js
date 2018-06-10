export const repeatPromise = (maxAttempts, sleepMs, promise) => {
  const attempt = attemptCount => {
    return new Promise((resolve, reject) => {
      promise()
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
