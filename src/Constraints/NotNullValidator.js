// @flow

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {getStringParam} from './utils';

export default class NotNullValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'not_null';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        if (value === null || value === undefined) {
            const message = getStringParam(constraint.params, 'message', 'validations.not_null');
            const violation = new Violation(message);
            context.addViolation(violation);
        }
    }
}
