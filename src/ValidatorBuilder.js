// @flow

import type {ConstraintValidatorInterface} from './ConstraintValidatorInterface';
import ConstraintValidatorChain from './ConstraintValidatorChain';
import Validator from './Validator';
import type {TranslatorInterface} from './TranslatorInterface';
import IdentityTranslator from './IdentityTranslator';
import {CollectionValidator, LengthValidator, NotBlankValidator, NotNullValidator} from './Constraints';


export default class ValidatorBuilder {
    constraintValidatorChain: ConstraintValidatorChain;
    translator: ?TranslatorInterface;

    constructor() {
        this.constraintValidatorChain = new ConstraintValidatorChain();
        this.addDefaultConstraintValidator();
    }

    addConstraintValidator(constraintValidator: ConstraintValidatorInterface): this {
        this.constraintValidatorChain.addConstraintValidator(constraintValidator);

        return this;
    }

    addDefaultConstraintValidator(): this {
        this
        .addConstraintValidator(new NotBlankValidator())
        .addConstraintValidator(new NotNullValidator())
        .addConstraintValidator(new CollectionValidator())
        .addConstraintValidator(new LengthValidator());

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
