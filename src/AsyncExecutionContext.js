// @flow

import Q from 'q';

import AbstractExecutionContext from './AbstractExecutionContext';
import type {InitType} from './AbstractExecutionContext';
import ViolationList from './ViolationList';
import type {ConstraintType} from './types';

export default class AsyncExecutionContext extends AbstractExecutionContext {
    constructor(config: InitType) {
        super(config);
    }

    new(config: InitType): AsyncExecutionContext {
        return new AsyncExecutionContext(config);
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]): Promise<any> {
        constraints = Array.isArray(constraints) ? constraints : [constraints];

        const promises = constraints.map(constraint => this.constraintValidator.asyncValidate(value, constraint, this));
        return Q.all(promises);
    }
}
