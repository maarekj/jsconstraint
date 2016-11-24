// @flow

import Q from 'q';
import invariant from 'invariant';

import {ExecutionContextInterface} from '../ExecutionContextInterface';
import type {ConstraintType} from '../types'
import Violation from '../Violation';
import {valueOrDefault} from './utils';

export default class LengthValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'length';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContextInterface) {
        invariant(constraint.name === 'length', `LengthValidator can validate only "length" constraint not "${constraint.name}" constraint.`);

        if (value === null || value === undefined || value === '') {
            return;
        }

        if (typeof value != 'string') {
            const notStringMessage = valueOrDefault(constraint.message, 'validations.not_string');
            context.addViolation(new Violation(notStringMessage));
            return;
        }

        if (constraint.max != null && value.length > constraint.max) {
            const maxMessage = valueOrDefault(constraint.maxMessage, 'validations.length_max');
            context.addViolation(new Violation(maxMessage));
        }

        if (constraint.min != null && value.length < constraint.min) {
            const minMessage = valueOrDefault(constraint.minMessage, 'validations.length_min');
            context.addViolation(new Violation(minMessage));
        }
    }

    asyncValidate(value: any, constraint: ConstraintType, context: ExecutionContextInterface): Promise<any> {
        return Q(this.validate(value, constraint, context));
    }
}
