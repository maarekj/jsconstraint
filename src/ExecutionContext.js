// @flow

import AbstractExecutionContext from './AbstractExecutionContext';
import type {InitType} from './AbstractExecutionContext';
import ViolationList from './ViolationList';
import type {ConstraintType} from './types';

export default class ExecutionContext extends AbstractExecutionContext {
    constructor(config: InitType) {
        super(config);
    }

    new(config: InitType): ExecutionContext {
        return new ExecutionContext(config);
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]) {
        constraints = Array.isArray(constraints) ? constraints : [constraints];

        for (const constraint of constraints) {
            this.constraintValidator.validate(value, constraint, this);
        }
    }
}
