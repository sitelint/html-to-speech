declare class HtmlToSpeech {
    constructor();
    private processHtml;
    convert(source: Element): string | null;
}

export { HtmlToSpeech };
