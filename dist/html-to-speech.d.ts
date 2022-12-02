declare class HtmlToSpeech {
    constructor();
    getSelectedOption(select: HTMLSelectElement): any;
    getTextFromNode(node: Node): string;
    private processHtml;
    convert(source: Element | Element[] | string, excludeElements?: HTMLElement | null | undefined | HTMLElement[]): string;
}

export { HtmlToSpeech };
