import NotNullValidator from '../NotNullValidator';
import Violation from '../../Violation';
import {mockExecutionContext} from '../../mocks';

describe.only('Test not blank validator', () => {
    const validator = new NotNullValidator();

    it('accept method', () => {
        expect(validator.acceptConstraint({name: 'not_null', params: {}})).toBe(true);
        expect(validator.acceptConstraint({name: 'not_found', params: {}})).toBe(false);
    });

    it('with valid value', () => {
        const context = mockExecutionContext();
        validator.validate("12345", {name: 'length', params: {}}, context);
        expect(context.addViolation).toHaveBeenCalledTimes(0);
    });

    it('with null value', () => {
        const context = mockExecutionContext();
        validator.validate(null, {name: 'length', params: {}}, context);

        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.not_null'));
    });

    it('with undefined value', () => {
        const context = mockExecutionContext();
        validator.validate(undefined, {name: 'length', params: {}}, context);

        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.not_null'));
    });

    it('with blank (valid) value', () => {
        const context = mockExecutionContext();
        validator.validate("", {name: 'length', params: {}}, context);

        expect(context.addViolation).toHaveBeenCalledTimes(0);
    });

    it('with invalid value and custom message', () => {
        const context = mockExecutionContext();
        validator.validate(null, {name: 'length', params: {message: "my message"}}, context);

        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('my message'));
    });
});
