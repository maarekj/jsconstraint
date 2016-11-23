import sortBy from 'lodash/sortBy';
import ValidatorBuilder from '../ValidatorBuilder';
import Validator from '../Validator';
import {NotNullValidator, NotBlankValidator, LengthValidator, CollectionValidator} from '../Constraints';

function sortViolations(violations) {
    return sortBy(violations, (violation) => violation.getPath(), (violation) => violation.getMessage());
}

describe('Test validator', () => {
    const validator = (new ValidatorBuilder())
    .addConstraintValidator(new NotBlankValidator())
    .addConstraintValidator(new NotNullValidator())
    .addConstraintValidator(new LengthValidator())
    .addConstraintValidator(new CollectionValidator())
    .buildValidator();

    describe('validate simple value', () => {
        describe('with valid value', () => {
            it('with one constraint', () => {
                const violations = validator.validate('value', {name: "not_null"});
                expect(violations.isEmpty()).toBe(true);
            });

            it('with one constraint wrapped in array', () => {
                const violations = validator.validate('value', [{name: "not_null"}]);
                expect(violations.isEmpty()).toBe(true);
            });

            it('with two constraints', () => {
                const violations = validator.validate('value', [{name: "not_null"}, {name: "length", max: 10}]);
                expect(violations.isEmpty()).toBe(true);
            });
        });

        describe('with invalid value', () => {
            it('with one constraint', () => {
                const violations = validator.validate(null, {name: "not_null"});
                expect(violations.count()).toBe(1);
                expect(violations.toArray()[0].getMessage()).toBe('validations.not_null');
            });

            it('with one constraint wrapped in array', () => {
                const violations = validator.validate(null, [{name: "not_null"}]);
                expect(violations.count()).toBe(1);
                expect(violations.toArray()[0].getMessage()).toBe('validations.not_null');
            });

            describe('with two constraints', () => {
                const constraints = [{name: 'length', min: 5}, {name: 'length', min: 10}];

                it('with one valid constraint and one invalid constraint', () => {
                    const violations = validator.validate("1234567", constraints);
                    expect(violations.isEmpty()).toBe(false);
                    expect(violations.count()).toBe(1);
                    expect(violations.toArray()[0].getMessage()).toBe('validations.length_min');
                });

                it('with two invalid constraints', () => {
                    const violations = validator.validate("123", constraints);
                    expect(violations.isEmpty()).toBe(false);
                    expect(violations.count()).toBe(2);
                    expect(violations.toArray()[0].getMessage()).toBe('validations.length_min');
                    expect(violations.toArray()[1].getMessage()).toBe('validations.length_min');
                });
            });
        });
    });

    describe('validate simple object', () => {
        describe('with valid object', () => {
            const object = {lastname: "maarek", firstname: "joseph"};

            it('with one constraint on lastname', () => {
                const violations = validator.validate(object, {name: 'collection', fields: {
                    lastname: {name: 'not_null'},
                }});

                expect(violations.isEmpty()).toBe(true);
            });

            it('with one constraint on lastname and one constraint on firstname', () => {
                const violations = validator.validate(object, {name: 'collection', fields: {
                    lastname: {name: 'not_null'},
                    firstname: {name: 'not_null'},
                }});

                expect(violations.isEmpty()).toBe(true);
            });

            it('with two constraint on each fields', () => {
                const violations = validator.validate(object, {name: 'collection', fields: {
                    lastname: [{name: 'not_null'}, {name: 'length', min: 5}],
                    firstname: [{name: 'not_null'}, {name: 'length', min: 5}],
                }});

                expect(violations.isEmpty()).toBe(true);
            });
        });

        describe('with invalid object', () => {
            const object = {lastname: "maarek", firstname: "joseph"};

            it('with one constraint on lastname', () => {
                let violations = validator.validate(object, {name: 'collection', fields: {
                    lastname: {name: 'length', min: 100},
                }}).toArray();
                violations = sortViolations(violations);

                expect(violations.length).toBe(1);

                expect(violations[0].getMessage()).toBe('validations.length_min');
                expect(violations[0].getPath()).toBe('lastname');
            });

            it('with one constraint on lastname and one constraint on firstname', () => {
                let violations = validator.validate(object, {name: 'collection', fields: {
                    lastname: {name: 'length', min: 100},
                    firstname: {name: 'length', min: 100},
                }}).toArray();
                violations = sortViolations(violations);

                expect(violations.length).toBe(2);

                expect(violations[0].getMessage()).toBe('validations.length_min');
                expect(violations[0].getPath()).toBe('firstname');

                expect(violations[1].getMessage()).toBe('validations.length_min');
                expect(violations[1].getPath()).toBe('lastname');
            });

            describe('with two constraint on each fields', () => {
                it('with one valid property and one invalid property', () => {
                    let violations = validator.validate(object, {name: 'collection', fields: {
                        lastname: [{name: 'length', min: 100}, {name: 'length', min: 50}],
                        firstname: [{name: 'length', min: 2}, {name: 'length', min: 5}],
                    }}).toArray();
                    violations = sortViolations(violations);

                    expect(violations.length).toBe(2);

                    expect(violations[0].getMessage()).toBe('validations.length_min');
                    expect(violations[0].getPath()).toBe('lastname');

                    expect(violations[1].getMessage()).toBe('validations.length_min');
                    expect(violations[1].getPath()).toBe('lastname');
                });

                it('with two invalid properties', () => {
                    let violations = validator.validate(object, {name: 'collection', fields: {
                        lastname: [{name: 'length', min: 100}, {name: 'length', min: 50}],
                        firstname: [{name: 'length', min: 100}, {name: 'length', min: 50}],
                    }}).toArray();
                    violations = sortViolations(violations);

                    expect(violations.length).toBe(4);

                    expect(violations[0].getMessage()).toBe('validations.length_min');
                    expect(violations[0].getPath()).toBe('firstname');

                    expect(violations[1].getMessage()).toBe('validations.length_min');
                    expect(violations[1].getPath()).toBe('firstname');

                    expect(violations[2].getMessage()).toBe('validations.length_min');
                    expect(violations[2].getPath()).toBe('lastname');

                    expect(violations[3].getMessage()).toBe('validations.length_min');
                    expect(violations[3].getPath()).toBe('lastname');
                });
            });
        });
    });

    describe('with nested object', () => {
        const constraints = {name: 'collection', fields: {
            age: {name: 'not_null'},
            name: [
                {name: 'not_null'},
                {name: 'collection', fields: {
                    lastname: {name: 'not_null'},
                    firstname: {name: 'not_null'},
                }},
            ],
            address: {
                name: 'collection',
                fields: {
                    city: {name: 'not_null'},
                },
            },
        }};

        it('with valid object', () => {
            const object = {
                age: 26,
                name: {
                    lastname: 'Maarek',
                    firstname: 'Joseph',
                },
                address: {
                    city: 'Paris',
                },
            };

            const violations = validator.validate(object, constraints);
            expect(violations.isEmpty()).toBe(true);
        });

        it('with invalid age', () => {
            const object = {
                age: null,
                name: {
                    lastname: 'Maarek',
                    firstname: 'Joseph',
                },
                address: {
                    city: 'Paris',
                },
            };

            let violations = validator.validate(object, constraints).toArray();
            violations = sortViolations(violations);

            expect(violations.length).toBe(1);
            expect(violations[0].getMessage()).toBe('validations.not_null');
            expect(violations[0].getPath()).toBe('age');
        });

        it('with invalid name.lastname', () => {
            const object = {
                age: 26,
                name: {
                    lastname: null,
                    firstname: 'Joseph',
                },
                address: {
                    city: 'Paris',
                },
            };

            let violations = validator.validate(object, constraints).toArray();
            violations = sortViolations(violations);

            expect(violations.length).toBe(1);
            expect(violations[0].getMessage()).toBe('validations.not_null');
            expect(violations[0].getPath()).toBe('name.lastname');
        });

        it('with invalid name', () => {
            const object = {
                age: 26,
                name: null,
                address: {
                    city: 'Paris',
                },
            };

            let violations = validator.validate(object, constraints).toArray();
            violations = sortViolations(violations);

            expect(violations.length).toBe(1);
            expect(violations[0].getMessage()).toBe('validations.not_null');
            expect(violations[0].getPath()).toBe('name');
        });

        it('with invalid age and invalid name', () => {
            const object = {
                age: null,
                name: null,
                address: {
                    city: 'Paris',
                },
            };

            let violations = validator.validate(object, constraints).toArray();
            violations = sortViolations(violations);

            expect(violations.length).toBe(2);

            expect(violations[0].getMessage()).toBe('validations.not_null');
            expect(violations[0].getPath()).toBe('age');

            expect(violations[1].getMessage()).toBe('validations.not_null');
            expect(violations[1].getPath()).toBe('name');
        });

        it('with invalid age and invalid name.lastname and invalid name.firstname', () => {
            const object = {
                age: null,
                name: {
                    lastname: null,
                    firstname: null,
                },
                address: {
                    city: 'Paris',
                },
            };

            let violations = validator.validate(object, constraints).toArray();
            violations = sortViolations(violations);

            expect(violations.length).toBe(3);

            expect(violations[0].getMessage()).toBe('validations.not_null');
            expect(violations[0].getPath()).toBe('age');

            expect(violations[1].getMessage()).toBe('validations.not_null');
            expect(violations[1].getPath()).toBe('name.firstname');

            expect(violations[2].getMessage()).toBe('validations.not_null');
            expect(violations[2].getPath()).toBe('name.lastname');
        });

        it('with address equal null', () => {
            const object = {
                age: 26,
                name: {
                    lastname: "Maarek",
                    firstname: "Joseph",
                },
                address: null,
            };

            let violations = validator.validate(object, constraints);
            expect(violations.isEmpty()).toBe(true);
        });
    });
});
