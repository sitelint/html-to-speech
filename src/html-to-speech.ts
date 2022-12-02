import { CommonUtilities } from './utilities/common.utilities';
import { FormElement } from './interfaces/hmtl-to-speech.interfaces';
import { NODE_TYPE } from './constants/constants';

export class HtmlToSpeech {
  constructor() { }

  public getSelectedOption(select: HTMLSelectElement): any {
    const options: HTMLOptionsCollection = select.options;
    const len: number = options.length - 1;

    for (let i: number = 0; i < len; i += 1) {
      if (options[i].selected) {
        return options[i];
      }
    }

    return null;
  }

  public getTextFromNode(node: Node): string {
    let text: string = '';
    let option: HTMLOptionElement;

    if (node.nodeType === NODE_TYPE.TEXT_NODE) {
      return (node as Text) .data;
    }

    switch (node.nodeName.toLowerCase()) {
      case 'img':
      case 'area':
        if ((node as HTMLImageElement | HTMLAreaElement).alt && (node as HTMLImageElement | HTMLAreaElement).alt.length) {
          text += (node as HTMLImageElement | HTMLAreaElement).alt;
        }
        break;

      case 'input':
      case 'output':
      case 'textarea':
        if (
          (node as FormElement).type === 'email' ||
          (node as FormElement).type === 'number' ||
          (node as FormElement).type === 'text' ||
          (node as FormElement).type === 'textarea'
        ) {
          text += (node as FormElement).value;
        } else if (
          (node as FormElement).type === 'image' &&
          typeof (node as HTMLInputElement).alt === 'string' &&
          (node as HTMLInputElement).alt.length
        ) {
          text += (node as HTMLInputElement).alt;
        }
        break;

      case 'select':
        option = this.getSelectedOption(node as HTMLSelectElement);
        text += option.textContent;
        break;

      default:
        break;
    }

    return text;
  }

  private processHtml(node: Node, excludeElements: Element[]): string {
    const element: Node = node;
    const notFound: string = '';
    const nodeList: string[] = [];

    if (CommonUtilities.isHtmlElement(element) === false) {
      return notFound;
    }

    const filterCallback: NodeFilter | null | undefined = {
      acceptNode: (_node: Node): number => {

        for (const elementToExclude of excludeElements) {
          if (elementToExclude === _node) {
            return NodeFilter.FILTER_REJECT;
          }
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    };

    const treeWalker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ALL, filterCallback);
    let text: string;

    while (treeWalker.nextNode()) {
      text = CommonUtilities.safeTrim(this.getTextFromNode(treeWalker.currentNode));

      if (text.length === 0) {
        continue;
      }

      if (text.endsWith('.') === false) {
        text += '.';
      }

      nodeList.push(text);
    }

    return nodeList.join(' ');
  }

  public convert(source: Element | Element[] | string, excludeElements: HTMLElement | HTMLElement[] = []): string {
    let stringFromSource: string = '';
    let elementsToProcess: Element[] = [];

    if (typeof source === 'string') {
      elementsToProcess = Array.from(document.querySelectorAll(source));
    } else {
      elementsToProcess = Array.isArray(source) ? source : [source];
    }

    let _excludeElements: HTMLElement[] = [];

    if (Array.isArray(excludeElements)) {
      _excludeElements = excludeElements;
    } else if (excludeElements) {
      _excludeElements = [excludeElements];
    }

    const excludedElements = (node: Element): boolean => {
      const foundedEl: HTMLElement = (node as any)?.proxiedNode || node;

      const findElement = (excludedElement: HTMLElement): boolean => {
        return foundedEl === excludedElement;
      };

      const index: number = _excludeElements.findIndex(findElement);

      return index === -1;
    };

    elementsToProcess = elementsToProcess.filter(excludedElements);

    for (const elementToProcess of elementsToProcess) {
      stringFromSource += this.processHtml(elementToProcess, _excludeElements);
    }

    return stringFromSource;
  }
}
