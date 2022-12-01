# HTML to Speech

Convert HTML to a readable string. To make your web page readable you need to convert it to the readable string.

## Demo

[HTML to Speech](https://www.sitelint.com/lab/html-to-speech/)

## Getting started

1. First download the package:

```bash
npm install @sitelintcode/html-to-speech --save
```

2. Usage:

```TypeScript
  import HtmlToSpeech from '@sitelint/html-to-speech';

  const htmlToSpeech: HtmlToSpeech = new HtmlToSpeech();

  const stringToRead: string = htmlToSpeech.convert(html: Element | string);
```

## Technical

1. `import { terser } from "rollup-plugin-terser";` was replaced with  `import { terser } from "rollup-plugin-minification";` because `rollup-plugin-terser` is not compatible with Rollup 3.x version. See: https://github.com/TrySound/rollup-plugin-terser/issues/119

## Contributing

Contributions are welcome, and greatly appreciated! Contributing doesn't just mean submitting pull requests. There are many different ways for you to get involved, including answering questions on the issues, reporting or triaging bugs, and participating in the features evolution process.

## License

MOZILLA PUBLIC LICENSE, VERSION 2.0
