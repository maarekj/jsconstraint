// @flow

import join from 'lodash/join';
import filter from 'lodash/filter';
import last from 'lodash/last';

import Violation from './Violation';
import ViolationList from './ViolationList';
import type {ExecutionContextInterface} from './ExecutionContextInterface';
import type {ConstraintValidatorInterface} from './ConstraintValidatorInterface';
import type {TranslatorInterface} from './TranslatorInterface';
import type {ConstraintType} from './types';

export type InitType = {
    root: any,
    translator: TranslatorInterface,
    constraintValidator: ConstraintValidatorInterface,
    parentContext: ?AbstractExecutionContext,
    prefixPath: ?string,
    currentObject: any,
    violations: ViolationList,
};

export default class AbstractExecutionContext {
    violations: ViolationList;
    constraintValidator: ConstraintValidatorInterface;
    root: any;
    translator: TranslatorInterface;
    parentContext: ?ExecutionContextInterface;
    prefixPath: ?string;
    currentObject: any;

    constructor(config: InitType) {
        this.root = config.root;
        this.translator = config.translator;
        this.constraintValidator = config.constraintValidator;
        this.parentContext = config.parentContext;
        this.prefixPath = config.prefixPath;
        this.currentObject = config.currentObject;
        this.violations = config.violations;
    }

    cloneContext(prefixPath: ?string, currentObject: any): ExecutionContextInterface {
        return this.new({
            root: this.root,
            translator: this.translator,
            constraintValidator: this.constraintValidator,
            parentContext: this,
            prefixPath: prefixPath,
            currentObject: currentObject,
            violations: this.violations,
        });
    }

    new(config: InitType): ExecutionContextInterface {
        throw 'must be implemented';
    }

    getParentContext(): ?ExecutionContextInterface {
        return this.parentContext;
    }

    addViolation(violation: Violation): this {
        violation = violation.atPath(this.resolvePath(violation.getPath()));

        const plural = violation.getPlural();

        if (plural != null) {
            violation = violation.withMessage(this.translator.transChoice(violation.getMessage(), plural, violation.getParameters()));
        } else {
            violation = violation.withMessage(this.translator.trans(violation.getMessage(), violation.getParameters()));
        }

        this.violations.addViolation(violation);

        return this;
    }

    resolvePath(path: ?string): string {
        const resolvedPath = join(filter([this.prefixPath, path]), '.');

        const parent = this.getParentContext();
        return parent == null ? resolvedPath : parent.resolvePath(resolvedPath);
    }

    getViolations(): ViolationList {
        return this.violations;
    }

    getCurrentObject(): any {
        return this.currentObject;
    }

    getRoot(): any {
        return this.root;
    }

    validate(value: any, constraints: ConstraintType|ConstraintType[]): any {
        throw 'must be implemented';
    }
}
