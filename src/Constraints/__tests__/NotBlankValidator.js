import NotBlankValidator from '../NotBlankValidator';
import Violation from '../../Violation';
import {mockExecutionContext} from '../../mocks';

describe('Test not blank validator', () => {
    const validator = new NotBlankValidator();

    it('accept method', () => {
        expect(validator.acceptConstraint({name: 'not_blank', params: {}})).toBe(true);
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
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.not_blank'));
    });

    it('with undefined value', () => {
        const context = mockExecutionContext();
        validator.validate(undefined, {name: 'length', params: {}}, context);
        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.not_blank'));
    });

    it('with blank value', () => {
        const context = mockExecutionContext();
        validator.validate("", {name: 'length', params: {}}, context);
        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('validations.not_blank'));
    });

    it('with invalid value and custom message', () => {
        const context = mockExecutionContext();
        validator.validate("", {name: 'length', params: {message: "my message"}}, context);
        expect(context.addViolation).toHaveBeenCalledTimes(1);
        expect(context.addViolation).toHaveBeenCalledWith(new Violation('my message'));
    });
});
