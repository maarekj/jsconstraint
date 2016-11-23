// @flow

export function getStringParam(params: {[key: string]: any}, path: string, defaultValue: string): string {
    if (params[path] == null || typeof params[path] != 'string') {
        return defaultValue;
    }

    return params[path];
}

export function getStringOrNull(params: {[key: string]: any}, path: string): ?string {
    if (params[path] == null || typeof params[path] != 'string') {
        return null;
    }

    return params[path];
}

export function getNumberParam(params: {[key: string]: any}, path: string, defaultValue: number): number {
    if (params[path] == null || typeof params[path] != 'number') {
        return defaultValue;
    }

    return params[path];
}

export function getNumberOrNull(params: {[key: string]: any}, path: string): ?number {
    if (params[path] == null || typeof params[path] != 'number') {
        return null;
    }

    return params[path];
}
