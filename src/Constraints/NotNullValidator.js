// @flow

import invariant from 'invariant';

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {valueOrDefault} from './utils';

export default class NotNullValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'not_null';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        invariant(constraint.name === 'not_null', `NotNullValidator can validate only "not_null" constraint not "${constraint.name}" constraint.`);

        if (value === null || value === undefined) {
            const message = valueOrDefault(constraint.message, 'validations.not_null');
            const violation = new Violation(message);
            context.addViolation(violation);
        }
    }
}
