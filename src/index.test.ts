import CallableDeferredPromise from "."

describe("CallableDeferredPromise", () => {
  it("should not execute until being awaited", async () => {
    const callback = jest.fn()
    const promise = new CallableDeferredPromise<
      ["foo", "bar"],
      ["foo", "bar"] | undefined
    >(args => resolve => {
      callback()
      resolve(args)
    })
    expect(callback).toHaveBeenCalledTimes(0)
    expect(await promise).toStrictEqual(undefined)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("should pass arguments", async () => {
    const callback = jest.fn()
    const promise = new CallableDeferredPromise<
      ["foo", "bar"],
      ["foo", "bar"] | undefined
    >(args => resolve => {
      callback()
      resolve(args)
    })
    expect(callback).toHaveBeenCalledTimes(0)
    expect(await promise("foo", "bar")).toStrictEqual(["foo", "bar"])
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("should resolve a `Promise`", async () => {
    const callback = jest.fn()
    const promise = new CallableDeferredPromise<
      ["foo", "bar"],
      ["foo", "bar"] | undefined
    >(args => resolve => {
      callback()
      resolve(new Promise(resolve => resolve(args)))
    })
    expect(callback).toHaveBeenCalledTimes(0)
    expect(await promise("foo", "bar")).toStrictEqual(["foo", "bar"])
    expect(callback).toHaveBeenCalledTimes(1)
  })
})