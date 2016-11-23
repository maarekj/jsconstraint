// @flow

import type {ConstraintValidatorInterface} from './ConstraintValidatorInterface';
import ConstraintValidatorChain from './ConstraintValidatorChain';
import Validator from './Validator';
import type {TranslatorInterface} from './TranslatorInterface';
import IdentityTranslator from './IdentityTranslator';

export default class ValidatorBuilder {
    constraintValidatorChain: ConstraintValidatorChain;
    translator: ?TranslatorInterface;

    constructor() {
        this.constraintValidatorChain = new ConstraintValidatorChain();
    }

    addConstraintValidator(constraintValidator: ConstraintValidatorInterface): this {
        this.constraintValidatorChain.addConstraintValidator(constraintValidator);

        return this;
    }

    withTranslator(translator: TranslatorInterface) {
        this.translator = translator;
    }

    buildValidator(): Validator {
        const translator = this.translator != null ? this.translator : new IdentityTranslator();
        return new Validator(this.constraintValidatorChain, translator);
    }
}
