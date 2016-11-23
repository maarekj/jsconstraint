// @flow

type NotNullConstraintType = {
    name: 'not_null',
    message?: ?string,
};

type NotBlankConstraintType = {
    name: 'not_blank',
    message?: ?string,
};

type LengthConstraintType = {
    name: 'length',
    message?: ?string,
    max?: ?number,
    min?: ?number,
    maxMessage?: ?string,
    minMessage?: ?string,
};

type CollectionConstraintType = {
    name: 'collection',
    fields: {[name: string]: ConstraintType|ConstraintType[]},
};

export type ConstraintType =
    NotNullConstraintType
    |NotBlankConstraintType
    |LengthConstraintType
    |CollectionConstraintType
    |{[key: string]: any};
