// @flow

import Q from 'q';

import {ExecutionContextInterface} from './ExecutionContextInterface';
import type {ConstraintValidatorInterface} from './ConstraintValidatorInterface';
import type {ConstraintType} from './types';

export default class ConstraintValidatorChain {
    validators: ConstraintValidatorInterface[];

    constructor() {
        this.validators = [];
    }

    addConstraintValidator(constraintValidator: ConstraintValidatorInterface): this {
        this.validators = [...this.validators, constraintValidator];

        return this;
    }

    acceptConstraint(constraint: ConstraintType): bool {
        for (const constraintValidator of this.validators) {
            if (constraintValidator.acceptConstraint(constraint)) {
                return true;
            }
        }

        return false;
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContextInterface): void {
        for (const constraintValidator of this.validators) {
            if (constraintValidator.acceptConstraint(constraint)) {
                constraintValidator.validate(value, constraint, context);
            }
        }
    }

    asyncValidate(value: any, constraint: ConstraintType, context: ExecutionContextInterface): Promise<any> {
        for (const constraintValidator of this.validators) {
            if (constraintValidator.acceptConstraint(constraint)) {
                return constraintValidator.asyncValidate(value, constraint, context);
            }
        }
        return Q(null);
    }
}
