const path = require('path');

import * as fs from 'fs/promises';

import { HtmlToSpeech } from './html-to-speech';
import { CommonUtilities } from './utilities/common.utilities';

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

    it('should return null when trying to get string from non-HTML element', async () => {
      const textToSpeech = htmlToSpeech.convert(Object.create(null));

      expect(textToSpeech).toBe(null);
    });

    it('should convert simple html from <h1> to a string', async () => {
      const htmlCode = await fs.readFile(path.resolve(`${process.cwd()}/src/samples/simple.html`), {
        encoding: 'utf8'
      });

      const htmlPage = CommonUtilities.stringToHTML(htmlCode);
      const h1 = htmlPage.body.querySelector('h1')!;
      const textToSpeech = htmlToSpeech.convert(h1);

      expect(textToSpeech).toBe('This is a sample page');
    });

  });

});
