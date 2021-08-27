# Punctuation Enforcer

The code in this repository is pretty much plug-and-play.

# Adaption

If you want to use this code in an environment where Javascript is used, but not HTML, then you must
adjust a few things. Though the changes you make largely depend on how your codebase interacts with
other code, the main changes are:

1. Remove the HTMLElement references:
```javascript
const input_element	 = document.getElementById("text_input_element");
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
