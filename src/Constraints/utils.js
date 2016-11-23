// @flow

export function valueOrDefault<T>(arg: ?T, defaultValue: T): T {
    return arg == null ? defaultValue : arg;
}

export function strictFirstNotNull<T>(args: Array<?T>, defaultValue: T): T {
    for (let arg of args) {
        if (arg != null) {
            return arg;
        }
    }

    return defaultValue;
}

export function firstNotNull<T>(args: Array<?T>, defaultValue: T): ?T {
    for (let arg of args) {
        if (arg != null) {
            return arg;
        }
    }

    return null;
}
