# Callable Deferred Promise

[![NPM](https://img.shields.io/npm/l/callable-deferred-promise)](LICENSE)
[![npm](https://img.shields.io/npm/v/callable-deferred-promise)](https://www.npmjs.com/package/callable-deferred-promise)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![microbundle](https://img.shields.io/badge/-📦%20microbundle-%23e3e7ea)](https://github.com/developit/microbundle)

A thin wrapper class to create a callable deferred `Promise`.

## Features

- Zero-dependency
- TypeScript support
- ESM/CJS/UMD support

## Example

```ts
import CallableDeferredPromise from "callable-deferred-promise"

type Options = { foo: "bar" }
const performSomeAsyncTask = async (
  options?: Options | undefined,
): Promise<void> => {
  // ...
}
const it = {
  resolves: new CallableDeferredPromise<[Options], void>(
    (args: [Options] | undefined) => resolve => {
      // `args` is `undefined` if it wasn't called
      if (args) {
        const [options] = args
        resolve(performSomeAsyncTask(options))
      } else {
        resolve(performSomeAsyncTask())
      }
    },
  ),
}

// use without a call
await it.resolves

// use with a call
const options: Options = { foo: "bar" }
await it.resolves(options)
```

## Why?

When your library is for networking, and it has some “core” API that has to be called every time your library is used, such as for initialization, then it may contain some async operations such as to establish connection to the backend, and such API may accept some options.

Say `Database` is a class, and `Database.connect` is a static async function which resolves to an instance of `Database`. Possible usage may look like:

```ts
// Initialize without options
const database = await Database.connect()

// Initialize with options
const database = await Database.connect({ ...options })
```

But calling a function without arguments **_looks_** a bit nonsense. Fortunately we have a way to remove the empty parentheses: a callable deferred promise.

```ts
// Initialize without options
const database = await Database.connect

// Initialize with options
const database = await Database.connect({ ...options })
```

The function passed to the constructor of `CallableDeferredPromise` is executed at the first time it was `await`ed, that's why this is called “deferred”. Even if the instance of `CallableDeferredPromise` was called, it's just to set the arguments to the internal variable, and the original function is not invoked immediately. You always have to `await` to run the original function.

CAVEAT: Use it carefully. It's unusual to perform some code without a call, so it may confuse users. You should use it only for the exact “core” API, which is the most appearance-sensitive part of your library in terms of branding (e.g. if your brand name is `Foobar Online` and the domain name is “foobar.online”, you want the initialization idiom for your library to be `await Foobar.online`).