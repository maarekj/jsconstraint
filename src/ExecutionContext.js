// @flow

import join from 'lodash/join';
import filter from 'lodash/filter';
import last from 'lodash/last';

import Violation from './Violation';
import ViolationList from './ViolationList';
import Validator from './Validator';
import type {TranslatorInterface} from './TranslatorInterface';
import type {ConstraintType} from './types';

export default class ExecutionContext {
    prefix: string[];
    violations: ViolationList;
    validator: Validator;
    root: any;
    objects: any[];
    translator: TranslatorInterface;

    constructor(root: any, translator: TranslatorInterface, validator: Validator) {
        this.prefix = [];
        this.validator = validator;
        this.violations = new ViolationList();
        this.root = root;
        this.objects = [root];
        this.translator = translator;
    }

    pushPrefixPath(prefix: string): this {
        this.prefix = [...this.prefix, prefix];

        return this;
    }

    popPrefixPath(): this {
        this.prefix.pop();

        return this;
    }

    pushObject(object: any): this {
        this.objects = [...this.objects, object];

        return this;
    }

    popObject(): this {
        this.objects.pop();

        return this;
    }

    addViolation(violation: Violation): this {
        if (this.prefix.length > 0) {
            violation = violation.atPath(
                join(filter([...this.prefix, violation.getPath() == '' ? null : violation.getPath()]), '.'),
            );
        }

        const plural = violation.getPlural();

        if (plural != null) {
            violation = violation.withMessage(this.translator.transChoice(violation.getMessage(), plural, violation.getParameters()));
        } else {
            violation = violation.withMessage(this.translator.trans(violation.getMessage(), violation.getParameters()));
        }

        this.violations.addViolation(violation);

        return this;
    }

    getViolations(): ViolationList {
        return this.violations;
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]): ViolationList {
        return this.validator.validateWithContext(value, constraints, this);
    }

    validateAtPath(path: string, value: any, constraints: ConstraintType|ConstraintType[]): ViolationList {
        this.pushPrefixPath(path);
        const violations = this.validator.validateWithContext(value, constraints, this);
        this.popPrefixPath();

        return violations;
    }

    getRoot(): any {
        return this.root;
    }

    getCurrentObject(): any {
        return last(this.objects);
    }
}
