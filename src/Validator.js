// @flow

import Q from 'q';

import AsyncExecutionContext from './AsyncExecutionContext';
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

    asyncValidate(value: any, constraints: ConstraintType|ConstraintType[]): Promise<ViolationList> {
        const context = new AsyncExecutionContext({
            translator: this.translator,
            constraintValidator: this.constraintValidator,
            parentContext: null,
            prefixPath: null,
            root: value,
            currentObject: value,
            violations: new ViolationList(),
        });
        return context.validate(value, constraints).then(() => {
            return context.getViolations();
        });
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]): ViolationList {
        const context = new ExecutionContext({
            translator: this.translator,
            constraintValidator: this.constraintValidator,
            parentContext: null,
            prefixPath: null,
            root: value,
            currentObject: value,
            violations: new ViolationList(),
        });
        context.validate(value, constraints);

        return context.getViolations();
    }
}
