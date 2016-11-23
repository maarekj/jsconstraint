// @flow

import invariant from 'invariant';

import ExecutionContext from '../ExecutionContext';
import type {ConstraintType} from '../types'
import Violation from '../Violation';

export default class CollectionValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'collection';
    }

    validate(value: any, constraint: ConstraintType, context: ExecutionContext) {
        invariant(constraint.name === 'collection', `CollectionValidator can validate only "collection" constraint not "${constraint.name}" constraint.`);

        if (value === null || value === undefined || value === '') {
            return;
        }

        for (const path of Object.keys(constraint.fields)) {
            context.pushObject(value);
            context.validateAtPath(path, value[path], constraint.fields[path]);
            context.popObject();
        }
    }
}
