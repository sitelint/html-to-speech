import { CommonUtilities } from './utilities/common.utilities';

export class HtmlToSpeech {
  constructor() { }

  private processHtml(element: Element): string | null {
    return element.textContent;
  }

  public convert(source: Element): string | null {
    let stringFromSource: string | null = null;

    if (CommonUtilities.isHtmlElement(source) === false) {
      return stringFromSource;
    }

    stringFromSource = this.processHtml(source);

    return stringFromSource;
  }
}
