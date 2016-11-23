// @flow

import Violation from './Violation';

export default class ViolationList {
    violations: Violation[];

    constructor() {
        this.violations = [];
    }

    addViolation(violation: Violation): this {
        this.violations = [...this.violations, violation];

        return this;
    }

    toArray(): Violation[] {
        return [...this.violations];
    }

    isEmpty(): bool {
        return this.violations.length === 0;
    }

    count(): number {
        return this.violations.length;
    }
}
