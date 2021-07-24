class ExtensibleFunction<A extends readonly unknown[], T> {
  constructor(f: (...args: A) => T) {
    return Object.setPrototypeOf(f, new.target.prototype)
  }
}

/**
 * Represents the completion of an asynchronous operation
 */
interface CallableDeferredPromise<A extends readonly unknown[], T>
  extends Promise<T> {
  (...args: A): Promise<T>
}
class CallableDeferredPromise<A extends readonly unknown[], T>
  extends ExtensibleFunction<A, Promise<T>>
  implements Promise<T> {
  private promise: Promise<T>
  private executor: CallableDeferredPromise.Executor<A, T> | undefined
  private resolve: ((value: T | PromiseLike<T>) => void) | undefined
  private reject: ((reason?: any) => void) | undefined
  private args: A | undefined

  constructor(executor: CallableDeferredPromise.Executor<A, T>) {
    super((...args: A) => {
      this.args = args
      return this
    })
    this.executor = executor
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  private async execute() {
    const executor = this.executor
    if (executor) {
      this.executor = undefined
      executor(this.args)(this.resolve!, this.reject!)
    }
  }

  /**
  * Attaches callbacks for the resolution and/or rejection of the Promise.
  * @param onfulfilled The callback to execute when the Promise is resolved.
  * @param onrejected The callback to execute when the Promise is rejected.
  * @returns A Promise for the completion of which ever callback is executed.
  */
  async then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    await this.execute()
    return await this.promise.then(onfulfilled, onrejected)
  }

  /**
  * Attaches a callback for only the rejection of the Promise.
  * @param onrejected The callback to execute when the Promise is rejected.
  * @returns A Promise for the completion of the callback.
  */
  async catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    await this.execute()
    return await this.promise.catch(onrejected)
  }

  /**
  * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
  * resolved value cannot be modified from the callback.
  * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
  * @returns A Promise for the completion of the callback.
  */
  async finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    await this.execute()
    return await this.promise.finally(onfinally)
  }

  get [Symbol.toStringTag]() {
    return "CallableDeferredPromise"
  }
}

namespace CallableDeferredPromise {
  export type Executor<A extends readonly unknown[], T> = (
    args: A | undefined,
  ) => (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
  ) => void
}

export default CallableDeferredPromise