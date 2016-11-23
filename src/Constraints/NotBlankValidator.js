// @flow

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {getStringParam} from './utils';

export default class NotBlankValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'not_blank';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        if (value === null || value === undefined || value === '') {
            const message = getStringParam(constraint.params, 'message', 'validations.not_blank');
            const violation = new Violation(message);
            context.addViolation(violation);
        }
    }
}
