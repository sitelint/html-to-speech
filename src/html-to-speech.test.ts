import { HtmlToSpeech } from './html-to-speech';

describe('HtmlToSpeech', () => {
  let htmlToSpeech: HtmlToSpeech;

  beforeEach(() => {
    htmlToSpeech = new HtmlToSpeech();
  });

  it('should determine the instance', () => {
    const instance: HtmlToSpeech = new HtmlToSpeech();

    expect(instance).toBeDefined();
  });

  describe('#convert', () => {

    it('should return null when trying to get string from non-HTML element', () => {
      const textToSpeech = htmlToSpeech.convert(Object.create(null));

      expect(textToSpeech).toBe('');
    });

    it('should convert simple html from <h1> to a string', () => {
      const doc = document.implementation.createHTMLDocument('New Document');
      const htmlCode = '<h1>This is a sample page</h1>';

      doc.body.innerHTML = htmlCode;

      const source = doc.querySelector('body')!;
      const textToSpeech = htmlToSpeech.convert(source);

      expect(textToSpeech).toBe('This is a sample page.');
    });

    it('should convert multiple selected HTML elements to a string and skip selected elements', () => {
      const doc = document.implementation.createHTMLDocument('New Document');
      const htmlCode = '<h1>This is a sample page</h1><button id="testButton">Action</button>';

      doc.body.innerHTML = htmlCode;

      const source = doc.querySelector('body')!;
      const skipElement = doc.querySelector('button');
      const textToSpeech = htmlToSpeech.convert(source, skipElement);

      expect(textToSpeech).toBe('This is a sample page.');
    });

    it('should convert selected HTML with <img/> content to a string', () => {
      const doc = document.implementation.createHTMLDocument('New Document');
      const htmlCode = '<h1>This is a sample page</h1><img src="" alt="Image alternative description" /><button id="testButton">Action</button>';

      doc.body.innerHTML = htmlCode;

      const source = doc.querySelector('body')!;
      const skipElement = doc.querySelector('button');
      const textToSpeech = htmlToSpeech.convert(source, skipElement);

      expect(textToSpeech).toBe('This is a sample page. Image alternative description.');
    });

  });

});
