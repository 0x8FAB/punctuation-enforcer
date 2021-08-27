# Punctuation Enforcer

The code in this repository is pretty much plug-and-play.

# Adaption

If you want to use this code in an environment where Javascript is used, but not HTML, then you must
adjust a few things. Though the changes you make largely depend on how your codebase interacts with
other code, the main changes are:

1. Remove the HTMLElement references:
```javascript
const input_element  = document.getElementById("text_input_element");
const output_element = document.getElementById("text_output_element");
```

2. Add a function parameter to `punctuate_input` that serves as the input text:
```javascript
function punctuate_input(input_text)
{
	// code
}
```

3. To allow for a plug-and-play experience, I suggest you return the output string from punctuate_input:
```javascript
function punctuate_input(input_text)
{
	var sentences = extract_sentences(input_text);

	// ...

	return sentences.join(' ');
}
```

The callsite will then look something like this:
```javascript
let input_text_punctuated = punctuate_input(the_input_text);
```

# MIT License

MIT License

Copyright (c) 2021 0x8FAB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
