// @flow

import Violation from './Violation';
import ViolationList from './ViolationList';
import type {ConstraintType} from './types';

export interface ExecutionContextInterface {
    cloneContext(prefixPath: ?string, object: any): ExecutionContextInterface;

    addViolation(violation: Violation): ExecutionContextInterface;
    getViolations(): ViolationList;

    validate(value: any, constraints: ConstraintType|ConstraintType[]): any;

    resolvePath(path: ?string): string;
    getParentContext(): ?ExecutionContextInterface;
    getRoot(): any;
    getCurrentObject(): any;
}
