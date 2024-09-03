import { LitElement } from "lit";
declare const TwLitElement: typeof LitElement;
export declare class MyButton extends TwLitElement {
    name: string;
    _isClicked: boolean;
    render(): import("lit-html").TemplateResult<1>;
    private _onClick;
}
export {};
