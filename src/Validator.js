// @flow

import ExecutionContext from './ExecutionContext';
import type {ConstraintType} from './types';
import type {ConstraintValidatorInterface} from './ConstraintValidatorInterface';
import ViolationList from './ViolationList';
import type {TranslatorInterface} from './TranslatorInterface';

export default class Validator {
    constraintValidator: ConstraintValidatorInterface;
    translator: TranslatorInterface;

    constructor(constraintValidator: ConstraintValidatorInterface, translator: TranslatorInterface) {
        this.constraintValidator = constraintValidator;
        this.translator = translator;
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]): ViolationList {
        const context = new ExecutionContext(value, this.translator, this);
        return this.validateWithContext(value, constraints, context);
    }

    validateWithContext(value: any, constraints: ConstraintType|ConstraintType[], context: ExecutionContext): ViolationList {
        constraints = Array.isArray(constraints) ? constraints : [constraints];

        for (const constraint of constraints) {
            this.constraintValidator.validate(value, constraint, context);
        }

        return context.getViolations();
    }
}
