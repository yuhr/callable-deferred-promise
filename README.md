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