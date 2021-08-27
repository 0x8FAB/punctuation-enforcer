// "This is a test sentence. Or maybe two? Well, fuck it... let's try four"
//
//	Created:
//		- 27 AUG 2021, 05:35 AM
//
//	Author: 
//		- 0x8FAB
//
//	Description:
//		- Takes as input a single string to transform. Some basic sanitizing is done and then
//		  punctuation is added.
//

//
// Relevant punctuation symbols. Well-formed sentences usually end with either of these three,
// sometimes in combination of one another.
//
const terminal_points = ['.', '?', '!'];

//
// A sentence can be of three natures;
//		1. it's a question;
//		2. it's a command, or something shouted;
//		3. it's a normal statement.
//
// A question ought to end with a question mark, a command or shouted message with an exclamation
// mark, and a statement with a dot. 
// 
// For more information of how these three natures are deduced from an input sentence, check out
// get_sentence_type().
//
const sentence_types  = ["question", "shout", "normal"]

//
// Question markers. get_sentence_type uses these words to determine whether a sentence is meant
// as a question. Additional context could be derived, but that's beyond the scope of this code.
//
// NOTE: for questions, technically not enough context exists. For example,
//
//		"Do that."				; Used as a sarcastic response
//		"How about that."		; Used to indicate some sort of epiphany; "Would you look at that."
//
// The program would consider that a sentence of a questioning nature, but that isn't the case.
// In such cases, ideally, you'd check if the follow-up word is "you":
//
//		"Do you [...]?"
//		"Do I [...]?"
//
// It can then be extended to:
//
//		"Does <subject> [...]?"
// 
// But again, that's beyond the scope of this code. The edge cases are endless.
//
const question_markers = ["how", "what", "where", "is", "has"];

//
// These are the elements on which these functions act. If you use this code in a different
// environment, make sure you adjust it accordingly.
//
const input_element	 = document.getElementById("text_input_element");
const output_element = document.getElementById("text_output_element");

//
// punctuate_input is the main function of this codebase. It parses all the sentences in the
// input text and calls other more detailed functions to transform each individual sentence.
//
// If you wish to force your own punctuation on all sentences, then this is the place to do it.
// I placed a (NOTE) at the place where you'd implement such a thing. However, I do not recommend 
// it. Humans are better at picking the right terminal points than this program.
//
// The goal is that the output is an improvement at all times.
//
function punctuate_input()
{
	// A single piece of text can have multiple sentences. We extract each so that they can be
	// individually transformed.
	var sentences = extract_sentences(input_element.value);

	// Tranform each sentence.
	for (let s = 0; s < sentences.length; s++)
	{
		if (sentences[s].length < 1)
			continue;

		// Capitalize the first letter.
		sentences[s] = sentences[s].charAt(0).toUpperCase() + sentences[s].slice(1);

		// Add our own terminal point if it's the last sentence and no terminal point
		// was appended to it by the user.
		//
		// NOTE: if you wish to force your own punctuation (as determined by the various
		// functions of this program), then this is where you need to make changes.
		if ((s == (sentences.length - 1)) && !is_terminal_point(sentences[s].slice(-1)))
		{
			let type = get_sentence_type(sentences[s]);
			let terminal_point = get_terminal_point_for_type(type);

			sentences[s] += terminal_point;
		}
	}

	// And finally, string all the sentences back together with a space in between each of them.
	output_element.innerHTML = sentences.join(' ');
}

//
// extract_sentences goes through a piece of text and extracts all sentences within in.
// This function assumes that all sentences within the text are delimited by terminal points;
// '?', '.', or '!', except for the last sentence.
//
// This function does not sanitize its input. It expects the caller to have done that.
//
function extract_sentences(text)
{
	let sentences = [];

	// start_index keeps track of the start of the current sentence.
	let start_index = 0;

	// end_index keeps track of the end of the current sentence.
	let end_index = text.length;

	// current_sentence is a string composed of the substring [start_index, end_index).
	let current_sentence = "";

	// A sentence is extracted with every iteration.
	let reached_end = false;
	while ((!reached_end) && (start_index < text.length))
	{
		// Find the next terminal point. But this may not be the "true" end of the sentence.
		end_index = find_next_terminal_point(text, (start_index + 1));
		if ((end_index == -1) || (end_index == (text.length - 1)))
		{
			end_index = text.length;
			reached_end = true;
		}
		else
		{
			// A sentence can punctually end with multiple terminal points; i.e., '...', '?!?', 
			// '!?!!!'; hence the loop below. We keep iterating further over the text until the 
			// true end of the sentence is found.
			if (((end_index + 1) < text.length) && is_terminal_point(text.charAt(end_index + 1)))
			{
				// Keep looping until the end of the terminal points is reached; which is the true
				// end of the sentence. One could argue that I can test for <terminal point><space>,
				// but that's not a guaranteed to produce the right result.
				let i = (end_index + 1);
				for (; i < text.length; i++)
				{
					// Keep going if the current character is a terminal point.
					if (!is_terminal_point(text.charAt(i)))
					{
						// Current character isn't a terminal point, so we've reached the true end
						// of the sentence.
						break;
					}
				}
				end_index = i;
			}
		}
		let sentence = text.slice(start_index, end_index).trim();
		sentences.push(sentence);

		start_index = end_index;
	}

	return sentences;
}

//
// find_next_terminal_point starts iterating the input text from start_index up until text.length.
// Each iteration then checks if the current character is a terminal point or not.
//
// It uses the global "terminal_points" array.
//
function find_next_terminal_point(text, start_index = 0)
{
	let index = start_index;
	for (; index < text.length; index++)
	{
		if (terminal_points.includes(text.charAt(index)))
			break;
	}

	// When the index is still equal to start_index, we can assume that no additional terminal 
	// points were found; indicated by -1.
	return (index == start_index) ? (-1) : (index - 1);
}

//
// is_terminal_point returns true if the input character is part of the following set:
//
// 		'.', '!', '?'
//
// It uses the global "terminal_points" array.
//
function is_terminal_point(character)
{
	return terminal_points.includes(character);
}

//
// get_sentence_type tries to deduce the context of the sentence; or rather, what its nature is.
// Is it a question, a command or shouted message, or a statement? Once the type is known, the
// right punctuation can be added, so you don't end up with sentence like:
//
//		"How are you."
//
//		"Today is a nice day?" 		; this one could be correct depending on intonation, but
//									; I can't deduce that from simple characters
//
//		"The weather is nice!"		; this one could also be correct, but again, there is no
//									; way of deducing that context.
//
// For a question, the function looks at the word with which the setence starts. Typically,
// a question begins with words such as "how", "what", "is", "has", etc.
//
// For a command or shouted message, the function looks if the message is entered in all caps.
//
// And the rest are considered statements.
//
function get_sentence_type(sentence)
{
	// Working with a lowercased version is easier.
	let lower_sentence = sentence.toLowerCase();

	let is_question = false;
	for (let q = 0; q < question_markers.length; q++)
	{
		if (lower_sentence.startsWith(question_markers[q]))
		{
			is_question = true;
			break;
		}
	}

	if (is_question)
	{
		return "question";
	}

	if (sentence.toUpperCase() === sentence)
	{
		return "shout";
	}

	return "normal";
}

//
// get_terminal_point_for_type is a simple helper function which returns the terminal point
// that is associated with the input type.
//
//		- question 	=> '?'
//		- shout 	=> '!'
//		- normal	=> '.'
//
// TODO(0x8FAB): put the types along with their associated terminal point in a HashMap.
//
function get_terminal_point_for_type(type)
{
	let terminal_point = '.'; // default case
	switch (type)
	{
		case "question":
			terminal_point = '?';
			break;
		case "shout":
			terminal_point = '!';
			break;
	}
	return terminal_point;
}
