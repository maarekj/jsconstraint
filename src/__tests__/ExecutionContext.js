import ExecutionContext from '../ExecutionContext';
import IdentityTranslator from '../IdentityTranslator';
import NotNullValidator from '../Constraints/NotNullValidator';
import ViolationList from '../ViolationList';

describe('Test ExecutionContext', () => {
    const context = new ExecutionContext({
        root: null,
        translator: new IdentityTranslator(),
        constraintValidator: new NotNullValidator,
        parentContext: null,
        prefixPath: null,
        currentObject: null,
        violations: new ViolationList(),
    });

    describe("resolve path", () => {
        it('on base context', () => {
            expect(context.resolvePath(null)).toBe('');
            expect(context.resolvePath('')).toBe('');
            expect(context.resolvePath('name')).toBe('name');
            expect(context.resolvePath('name.lastname')).toBe('name.lastname');
        });

        it('on nested context', () => {
            const nestedContext = context.cloneContext('name', context.getCurrentObject());

            expect(nestedContext.resolvePath(null)).toBe('name');
            expect(nestedContext.resolvePath('')).toBe('name');
            expect(nestedContext.resolvePath('lastname')).toBe('name.lastname');
            expect(nestedContext.resolvePath('lastname.uppercase')).toBe('name.lastname.uppercase');
        });

        it('on double nested context', () => {
            const nestedContext = context
            .cloneContext('user', context.getCurrentObject())
            .cloneContext('name', context.getCurrentObject());

            expect(nestedContext.resolvePath(null)).toBe('user.name');
            expect(nestedContext.resolvePath('')).toBe('user.name');
            expect(nestedContext.resolvePath('lastname')).toBe('user.name.lastname');
            expect(nestedContext.resolvePath('lastname.uppercase')).toBe('user.name.lastname.uppercase');
        });
    });
});
