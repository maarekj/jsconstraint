import LengthValidator from '../LengthValidator';
import Violation from '../../Violation';
import {mockExecutionContext} from '../../mocks';

describe('Test length validator', () => {
    const validator = new LengthValidator();
    it('accept method', () => {
        expect(validator.acceptConstraint({name: 'length', params: {}})).toBe(true);
        expect(validator.acceptConstraint({name: 'not_found', params: {}})).toBe(false);
    });

    describe('with max params', () => {
        it('with blank value', () => {
            const context = mockExecutionContext();
            validator.validate("", {name: 'length', params: {max: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        it('with valid value', () => {
            const context = mockExecutionContext();
            validator.validate("1234", {name: 'length', params: {max: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        it('with just valid value', () => {
            const context = mockExecutionContext();
            validator.validate("12345", {name: 'length', params: {max: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        describe('with invalid value', () => {
            it('with not message provided', () => {
                const context = mockExecutionContext();
                validator.validate("123456", {name: 'length', params: {max: 5}}, context);
                expect(context.addViolation).toHaveBeenCalledTimes(1);
                expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.length_max'));
            });

            it('with message provided', () => {
                const context = mockExecutionContext();
                validator.validate("123456", {name: 'length', params: {max: 5, maxMessage: "my message"}}, context);
                expect(context.addViolation).toHaveBeenCalledTimes(1);
                expect(context.addViolation).toHaveBeenCalledWith(new Violation('my message'));
            });
        });
    });

    describe('with min params', () => {
        it('with blank value', () => {
            const context = mockExecutionContext();
            validator.validate("", {name: 'length', params: {min: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        it('with valid value', () => {
            const context = mockExecutionContext();
            validator.validate("123456", {name: 'length', params: {min: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        it('with just valid value', () => {
            const context = mockExecutionContext();
            validator.validate("12345", {name: 'length', params: {min: 5}}, context);
            expect(context.addViolation).toHaveBeenCalledTimes(0);
        });

        describe('with invalid value', () => {
            it('with not message provided', () => {
                const context = mockExecutionContext();
                validator.validate("1234", {name: 'length', params: {min: 5}}, context);
                expect(context.addViolation).toHaveBeenCalledTimes(1);
                expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.length_min'));
            });

            it('with message provided', () => {
                const context = mockExecutionContext();
                validator.validate("1234", {name: 'length', params: {min: 5, minMessage: "my message"}}, context);
                expect(context.addViolation).toHaveBeenCalledTimes(1);
                expect(context.addViolation).toHaveBeenCalledWith(new Violation('my message'));
            });
        });
    });
});
