import ConstraintValidatorChain from '../ConstraintValidatorChain';

class Fixture1ConstraintValidator {
    acceptConstraint(constraint) {
        return constraint.name === 'fixture1';
    }

    validate(value, constraint, context) {
        if (value !== 'fixture1') {
            context.addError('error not fixture1');
        }
    }
}

class Fixture2ConstraintValidator {
    acceptConstraint(constraint) {
        return constraint.name === 'fixture2';
    }

    validate(value, constraint, context) {
        if (value !== 'fixture2') {
            context.addError('error not fixture2');
        }
    }
}

class Context {
    constructor() {
        this.errors = [];
    }

    addError(error) {
        this.errors = [...this.errors, error];
    }
}

describe('Test constraint validator chain', () => {
    const chain = new ConstraintValidatorChain();
    chain
        .addConstraintValidator(new Fixture1ConstraintValidator())
        .addConstraintValidator(new Fixture2ConstraintValidator());

    it('accept method', () => {
        expect(chain.acceptConstraint({name: 'fixture1', params: {}})).toBe(true);
        expect(chain.acceptConstraint({name: 'fixture2', params: {}})).toBe(true);
        expect(chain.acceptConstraint({name: 'not_found', params: {}})).toBe(false);
    });

    it('validate constraint fixture 1 with invalid value', () => {
        let context = new Context();
        chain.validate('invalid', {name: 'fixture1', params: {}}, context);
        expect(context.errors).toContainEqual("error not fixture1");
    });

    it('validate constraint fixture 2 with invalid value', () => {
        let context = new Context();
        chain.validate('invalid', {name: 'fixture2', params: {}}, context);
        expect(context.errors).toContainEqual("error not fixture2");
    });

    it('validate constraint fixture 1 with valid value', () => {
        let context = new Context();
        chain.validate('fixture1', {name: 'fixture1', params: {}}, context);
        expect(context.errors.length).toBe(0);
    });

    it('validate constraint fixture 2 with valid value', () => {
        let context = new Context();
        chain.validate('fixture2', {name: 'fixture2', params: {}}, context);
        expect(context.errors.length).toBe(0);
    });
});
