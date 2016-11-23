// @flow

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';

export default class CollectionValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'collection';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        if (value === null || value === undefined || value === '') {
            return;
        }

        const fields = constraint.params.fields == null ? {} : constraint.params.fields;

        for (const path of Object.keys(fields)) {
            context.pushObject(value);
            context.validateAtPath(path, value[path], fields[path]);
            context.popObject();
        }
    }
}
