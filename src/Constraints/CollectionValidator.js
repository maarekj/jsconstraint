// @flow

import Q from 'q';
import invariant from 'invariant';
import map from 'lodash/map';

import {ExecutionContextInterface} from '../ExecutionContextInterface';
import type {ConstraintType} from '../types'
import Violation from '../Violation';

export default class CollectionValidator {
    acceptConstraint(constraint: ConstraintType): bool {
        return constraint.name === 'collection';
    }

    validate(object: any, constraint: ConstraintType, context: ExecutionContextInterface) {
        invariant(constraint.name === 'collection', `CollectionValidator can validate only "collection" constraint not "${constraint.name}" constraint.`);

        if (object === null || object === undefined || object === '') {
            return;
        }

        for (const path of Object.keys(constraint.fields)) {
            context.cloneContext(path, object).validate(object[path], constraint.fields[path]);
        }
    }

    asyncValidate(object: any, constraint: ConstraintType, context: ExecutionContextInterface): Promise<any> {
        invariant(constraint.name === 'collection', `CollectionValidator can validate only "collection" constraint not "${constraint.name}" constraint.`);

        if (object === null || object === undefined || object === '') {
            return Q(null);
        }

        const promises = map(constraint.fields, (constraint, path) =>{
            return context.cloneContext(path, object).validate(object[path], constraint)
        });

        return Q.all(promises);
    }
}
