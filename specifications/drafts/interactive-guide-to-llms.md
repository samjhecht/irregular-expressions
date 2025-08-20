# Website: Interactive Step by Step Guide to LLMs

Your objective is to build the optimal interactive guide for helping someone understand how LLMs work.

We are going to make it a non-discoverable page on my personal website, irregular-expressions.com.   

On the page, the user will be able to insert a prompt for an LLM. The query will then get submitted to an LLM and we'll have the response and the prompt. The user will then be shown a diagram of the entire LLM chat lifecycle geared at helping them understand how LLMs work. The user should be able to click into steps to expand them and when they do, it should expand into showing additional steps. In some cases, the additional steps will also be expandable, depending on the complexity of the step.

You should think deeply about how we should organize all of the text content.  

Other Objectives When Creating the Flow:

- where possible, we should use real examples of what the data at a particular step actually looks like. For example, if you need to show how a prompt gets converted to tokens, you can take the prompt that was submitted by the user and actually convert it to the tokens. If you needed to talk about a vector database, you can actually show a representation of how vector databases store data. etc.
- We don't want to go totally overboard in terms of the level of detail. Let's assume that the end user is a software engineer who is new to LLMs. So, we can skip documenting things that the average software would already completely understand.

In the second phase of the project, you will implement the UI. It should:

- be beautiful and capture the eye.
- be responsive
- Use D3.js for mixing in some cool effects and visualizations
- Be modern looking
- support light and dark mode
- Use anthropic for the LLM (choosing a super cheap model for processing the user's prompt)
