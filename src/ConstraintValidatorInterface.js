// @flow

import ExecutionContext from './ExecutionContext';
import type {ConstraintType} from './types'

export interface ConstraintValidatorInterface {
    acceptConstraint(constraint: ConstraintType): bool;
    validate(value: any, constraint: ConstraintType, context: ExecutionContext): void;
}
