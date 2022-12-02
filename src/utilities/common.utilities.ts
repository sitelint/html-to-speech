import { Context } from '../interfaces/hmtl-to-speech.interfaces';

// Note: safeTrim related constants

const SP: string = ' ';
const TAB: string = '\t';
const CR: string = '\r';
const LF: string = '\n';
const CR_LF = '\r\n';
const ZERO_WIDTH_SPACE: string = '\v' + // \x0B VT 垂直制表符
  '\f' + //  \x0C FF 换页符
  '\u200B\u200C\u200D\u200E\u200F\u000b\u2028\u2029\uFEFF\u202D';
const OTHER_SPACE: string = '\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
const ALL_SPACES: string = SP + TAB + CR + LF + CR_LF + ZERO_WIDTH_SPACE + OTHER_SPACE;

const leftReg: RegExp = new RegExp(`^[${ALL_SPACES}]+`);
const rightReg: RegExp = new RegExp(`[${ALL_SPACES}]+$`);
const zeroReg: RegExp = new RegExp(`[${ZERO_WIDTH_SPACE}]+`, 'g');
const otherReg: RegExp = new RegExp(`[${OTHER_SPACE}]+`, 'g');

export class CommonUtilities {
  private static reMethod: RegExp = /^(function|object)$/;
  private static reUnknown: RegExp = /^unknown$/;

  public static isHtmlElement(el: any): boolean {
    if (el === null) {
      return false;
    }

    try {
      return el instanceof Element || el instanceof Document;
    } catch (t) {
      return (
        typeof el === 'object' &&
        el.nodeType === Node.ELEMENT_NODE &&
        typeof el.style === 'object' &&
        typeof el.ownerDocument === 'object'
      );
    }
  }

  public static isHostMethod(obj: any, method: string): boolean {
    if (!obj) {
      return false;
    }

    const t: string = typeof obj[method];

    return this.reUnknown.test(t) || (this.reMethod.test(t) && Boolean(obj)) || false;
  }

  public static stringToHTML(str: string): Document {
    let doc: Document;

    if (CommonUtilities.isHostMethod(globalThis, 'DOMParser')) {
      const parser: DOMParser = new DOMParser();

      doc = parser.parseFromString(str, 'text/html');

      return doc;
    }

    doc = document.implementation.createHTMLDocument('New Document');

    doc.body.innerHTML = str;

    return doc;
  }

  public static contains(parentNode: Element, childNode: Element): boolean {

    if (CommonUtilities.isHtmlElement(parentNode) === false) {
      return false;
    }

    if (CommonUtilities.isHostMethod(parentNode, 'contains')) {
      return parentNode.contains(childNode);
    }

    return Boolean(parentNode.compareDocumentPosition(childNode) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  /**
   * Note: proxiedNode is used by CloudFlare Rocket Loader
   * See https://developers.cloudflare.com/fundamentals/speed/rocket-loader/
   */

  public static querySelectorAllExclude(selector: string, context?: Context | null, excludeElements?: HTMLElement | null | undefined | HTMLElement[]): Element[] | null {
    const queryResults: NodeListOf<Element> = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);

    let _excludeElements: HTMLElement[] = [];

    if (Array.isArray(excludeElements)) {
      _excludeElements = excludeElements;
    } else if (excludeElements) {
      _excludeElements = [excludeElements];
    }

    let result: NodeListOf<Element> | Element[] = Array.from(queryResults);

    if (queryResults.length === 0) {
      return result;
    }

    const excludedElements = (node: Element): boolean => {
      const foundedEl: HTMLElement = (node as any)?.proxiedNode || node;

      const findElement = (excludedElement: HTMLElement): boolean => {
        return foundedEl === excludedElement;
      };

      const index: number = _excludeElements.findIndex(findElement);

      return index === -1;
    };

    result = result.filter(excludedElements);

    return result;
  }

  public static safeTrim(string: string): string {
    return string
      .replace(leftReg, '')
      .replace(rightReg, '')
      .replace(new RegExp(TAB, 'g'), '')
      .replace(new RegExp(CR_LF, 'g'), LF)
      .replace(new RegExp(CR, 'g'), LF)
      .replace(zeroReg, '')
      .replace(otherReg, '')
      .trim();
  }
}
