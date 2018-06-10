# promise-repeater [![Build Status](https://travis-ci.org/jakedeichert/promise-repeater.svg?branch=master)](https://travis-ci.org/jakedeichert/promise-repeater)

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
~~~
