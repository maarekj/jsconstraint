// @flow

export interface TranslatorInterface {
    trans(key: string, params: {[key: string]: string}): string;
    transChoice(key: string, number: number, params: {[key: string]: string}): string;
}
