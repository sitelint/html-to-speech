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
}
