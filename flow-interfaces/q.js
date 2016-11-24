/* @flow */

declare type Q$PromiseState<T> = {
   state: "fulfilled"|"rejected"|"pending",
   value?: T,
   reason?: any,
};

declare class Q$Defer<T> {
    promise: Q$Promise<T>;
    resolve(value: T): void;
    resolve(value: Promise<T>): void;
    reject(reason: any): void;
    notify(value: any): void;
    makeNodeResolver(): (reason: any, value: T) => void;
}

declare class Q$Promise<+T> extends Promise<T> {
    fin(finallyCallback: () => any): Q$Promise<T>;
    finally(finallyCallback: () => any): Q$Promise<T>;
    then<U>(onFulfill?: ?(value: T) => Promise<U> | ?U, onReject?: ?(error: any) => Promise<U> | ?U): Q$Promise<U>;
    catch<U>(onReject?: (error: any) => ?Promise<U> | U): Q$Promise<U>;
    spread<U>(onFulfill: (...args: any[]) => Promise<U> | U, onReject?: (reason: any) => Promise<U> | U): Q$Promise<U>;
    fail<U>(onRejected: (reason: any) => U | Promise<U>): Q$Promise<U>;
    progress(onProgress: (progress: any) => any): Q$Promise<T>;
    nodeify(callback: (reason: any, value: any) => void): Q$Promise<T>;
    get<U>(propertyName: string): Q$Promise<U>;
    set<U>(propertyName: string, value: any): Q$Promise<U>;
    //delete<U>(propertyName: String): Q$Promise<U>;
    post<U>(methodName: String, args: any[]): Q$Promise<U>;
    invoke<U>(methodName: String, ...args: any[]): Q$Promise<U>;
    fapply<U>(args: any[]): Q$Promise<U>;
    fcall<U>(...args: any[]): Q$Promise<U>;
    keys(): Q$Promise<string[]>;
    thenResolve<U>(value: U): Q$Promise<U>;
    thenReject(reason: any): Q$Promise<T>;
    tap(onFulfilled: (value: T) => any): Q$Promise<T>;
    timeout(ms: number, message?: string): Q$Promise<T>;
    delay(ms: number): Q$Promise<T>;
    isFulfilled(): boolean;
    isRejected(): boolean;
    isPending(): boolean;
    valueOf(): any;
    inspect(): Q$PromiseState<T>;
}

declare module q {
    declare class Q {
        static (value: number): Q$Promise<number>;
        static (value: string): Q$Promise<string>;
        static <T>(value: Promise<T>): Q$Promise<T>;
        static <T>(value: Q$Promise<T>): Q$Promise<T>;
        static <T>(value: T): Q$Promise<T>;

        static when(): Promise<void>;
        static when<T>(value: T | Promise<T>): Q$Promise<T>;
        static when<T, U>(value: T | Promise<T>, onFulfilled: (val: T) => U | Promise<U>, onRejected?: (reason: any) => U | Promise<U>, onProgress?: (progress: any) => any): Q$Promise<U>;

        static fbind<T>(method: (...args: any[]) => T | Promise<T>, ...args: any[]): (...args: any[]) => Q$Promise<T>;

        static fcall<T>(method: (...args: any[]) => T, ...args: any[]): Q$Promise<T>;

        static send<T>(obj: any, functionName: string, ...args: any[]): Q$Promise<T>;
        static invoke<T>(obj: any, functionName: string, ...args: any[]): Q$Promise<T>;
        static mcall<T>(obj: any, functionName: string, ...args: any[]): Q$Promise<T>;

        static denodeify<T>(nodeFunction: Function, ...args: any[]): (...args: any[]) => Q$Promise<T>;
        static nbind<T>(nodeFunction: Function, thisArg: any, ...args: any[]): (...args: any[]) => Q$Promise<T>;
        static nfbind<T>(nodeFunction: Function, ...args: any[]): (...args: any[]) => Q$Promise<T>;
        static nfcall<T>(nodeFunction: Function, ...args: any[]): Q$Promise<T>;
        static nfapply<T>(nodeFunction: Function, args: any[]): Q$Promise<T>;

        static ninvoke<T>(nodeModule: any, functionName: string, ...args: any[]): Q$Promise<T>;
        static npost<T>(nodeModule: any, functionName: string, args: any[]): Q$Promise<T>;
        static nsend<T>(nodeModule: any, functionName: string, ...args: any[]): Q$Promise<T>;
        static nmcall<T>(nodeModule: any, functionName: string, ...args: any[]): Q$Promise<T>;

        static all<T>(promises: Promise<T>[]): Q$Promise<T[]>;
        static race<T>(promises: Promise<T>[]): Q$Promise<T>;
        static allSettled<T>(promises: Promise<T>[]): Q$Promise<Q$PromiseState<T>[]>;
        static allResolved<T>(promises: Promise<T>[]): Q$Promise<Promise<T>[]>;
        static spread<T, U>(promises: Promise<T>[], onFulfilled: (...args: T[]) => U | Promise<U>, onRejected?: (reason: any) => U | Promise<U>): Q$Promise<U>;
        static timeout<T>(promise: Promise<T>, ms: number, message?: string): Q$Promise<T>;
        static delay<T>(promise: Promise<T>, ms: number): Q$Promise<T>;
        static delay<T>(value: T, ms: number): Q$Promise<T>;
        static delay(ms: number): Q$Promise <void>;
        static defer<T>(): Q$Defer<T>;
        static reject<T>(reason?: any): Q$Promise<T>;
        static promised<T>(callback: (...args: any[]) => T): (...args: any[]) => Q$Promise<T>;
        static isPromise(object: any): boolean;
        static isPromiseAlike(object: any): boolean;
        static isPending(object: any): boolean;
        static async<T>(generatorFunction: any): (...args: any[]) => Q$Promise<T>;
        static nextTick(callback: Function): void;

        static Promise<T>(resolver: (resolve: (val: T | Promise<T>) => void, reject: (reason: any) => void , notify: (progress: any) => void) => void): Q$Promise<T>;

        static onerror: (reason: any) => void;
        static longStackSupport: boolean;
        static stopUnhandledRejectionTracking(): void;
    }

    declare var exports: Class<Q>;
}
