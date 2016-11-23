// @flow

import invariant from 'invariant';

type ViolationType = {
    message: string,
    parameters: {[key: string]: string},
    path: ?string,
    plural: ?number,
};

export default class Violation {
    data: ViolationType;

    constructor(message: string) {
        this.data = {
            message,
            parameters: {},
            path: null,
            plural: null,
        };
    }

    clone(data: $Shape<ViolationType>): Violation {
        const newViolation = new Violation(data.message);
        newViolation.data = {
            ...this.data,
            ...newViolation.data,
            parameters: data.parameters == null ? {} : data.parameters,
            ...data,
        };

        return newViolation;
    }

    withMessage(message: string): Violation {
        return this.clone({
            ...this.data,
            message,
        });
    }

    getMessage(): string {
        return this.data.message;
    }

    addParameter(key: string, value: string): Violation {
        return this.clone({
            ...this.data,
            parameters: {
                ...this.data.parameters,
                [key]: value,
            },
        });
    }

    getParameters(): {[key: string]: string} {
        return this.data.parameters;
    }

    atPath(path: string): Violation {
        return this.clone({
            ...this.data,
            path,
        });
    }

    getPath(): ?string {
        return this.data.path;
    }

    getPlural(): ?number {
        return this.data.plural
    }

    withPlural(plural: ?number): Violation {
        return this.clone({
            ...this.data,
            plural,
        })
    }

    noPlural(): Violation {
        return this.clone({
            ...this.data,
            plural: null,
        })
    }
}
