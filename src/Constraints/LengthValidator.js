// @flow

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {getStringParam, getNumberOrNull} from './utils';

export default class LengthValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'length';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        if (value === null || value === undefined || value === '') {
            return;
        }

        if (typeof value != 'string') {
            const notStringMessage = getStringParam(constraint.params, 'message', 'validations.not_string');
            context.addViolation(new Violation(notStringMessage));
            return;
        }

        const max = getNumberOrNull(constraint.params, 'max');
        if (max != null && value.length > max) {
            const maxMessage = getStringParam(constraint.params, 'maxMessage', 'validations.length_max');
            context.addViolation(new Violation(maxMessage));
        }

        const min = getNumberOrNull(constraint.params, 'min');
        if (min != null && value.length < min) {
            const minMessage = getStringParam(constraint.params, 'minMessage', 'validations.length_min');
            context.addViolation(new Violation(minMessage));
        }
    }
}
