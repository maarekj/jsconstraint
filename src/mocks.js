export function mockExecutionContext() {
    return {
        addViolation: jest.fn(() => this),
        validate: jest.fn(),
        validateAtPath: jest.fn(),
    };
}
