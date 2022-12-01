declare class HtmlToSpeech {
    constructor();
    convert(source: Element): string | null;
}

export { HtmlToSpeech };
