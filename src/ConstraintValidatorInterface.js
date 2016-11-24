// @flow

import {ExecutionContextInterface} from './ExecutionContextInterface';
import type {ConstraintType} from './types'

export interface ConstraintValidatorInterface {
    acceptConstraint(constraint: ConstraintType): bool;
    validate(value: any, constraint: ConstraintType, context: ExecutionContextInterface): void;
    asyncValidate(value: any, constraint: ConstraintType, context: ExecutionContextInterface): Promise<any>;
}
