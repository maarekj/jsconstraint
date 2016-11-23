// @flow

export default class IdentityTranslator {
    trans(key: string, params: {[key: string]: string}): string {
        return key;
    }

    transChoice(key: string, number: number, params: {[key: string]: string}): string {
        return key;
    }
}
