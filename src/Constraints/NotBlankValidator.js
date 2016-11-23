// @flow

import invariant from 'invariant';

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {valueOrDefault} from './utils';

export default class NotBlankValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'not_blank';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        invariant(constraint.name === 'not_blank', `NotBlankValidator can validate only "not_blank" constraint not "${constraint.name}" constraint.`);

        if (value === null || value === undefined || value === '') {
            const message = valueOrDefault(constraint.message, 'validations.not_blank');
            const violation = new Violation(message);
            context.addViolation(violation);
        }
    }
}
