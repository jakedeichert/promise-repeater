# promise-repeater [![build status][ci_badge]][github_ci]

⏰ Repeat promises until they resolve successfully or hit the maximum attempt limit


## Installation

~~~sh
yarn add @jakedeichert/promise-repeater
# or
npm i @jakedeichert/promise-repeater
~~~


## Usage

~~~js
import { repeatPromise } from '@jakedeichert/promise-repeater';

// Create a function that returns the promise you want to attempt multiple times
const promiseFunc = () => {
    return new Promise((resolve, reject) => {
        if (Math.random() < 0.5) return reject();
        resolve('success');
    });
};


// Repeat this promise until it resolves or hits the maximum attempt limit option
// This example will reject after 5 attempts
const val1 = await repeatPromise(promiseFunc, 5);


// You can also specify a delay (ms) between attempts
// This example waits 1 second between attempts
const val2 = await repeatPromise(promiseFunc, 5, 1000);


// You could also attempt an infinite amount of times
const val3 = await repeatPromise(promiseFunc, Infinity, 1000);
~~~

Try this out on [RunKit](https://npm.runkit.com/@jakedeichert/promise-repeater)






<!-- Badge from here: https://github.com/atrox/github-actions-badge -->
[github_ci]: https://actions-badge.atrox.dev/jakedeichert/promise-repeater/goto
[ci_badge]: https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fjakedeichert%2Fpromise-repeater%2Fbadge&label=build&logo=none
