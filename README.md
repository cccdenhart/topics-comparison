# Pioneer Engineering Take Home project: Apples to Oranges

This is an open ended project, where you will build a simple webapp from scratch.

This app allows us to compare how the result of LLM prompts compare if given different initial conditions.

Spend 3-4 hours doing this project. If you end up spending more, this will not negatively affect your score (we understand that surprising bugs can sometimes take more time to figure out). This is an open-book project. Feel free to use search, and even copilot or chatgpt to help you with the submission. 

We can also create a slack channel where you can message Mitko any questions that come up. 

# Use case

A user of the webapp would input two different topics, and a series of websites/articles describing each topic.

Then they will write a question/prompt about these websites and see how the result of the prompt compare for these two topics. The results will be obtained by calling some kind of large language model like GPT-4.

# Minimum Requirements

Here’s a list of requirements in the user story format (As a **persona**, I want **feature**, so that I can **have benefit**)

- As a user, I want to be able to input two different websites URLs, so that I can refer to two different topics.
- As a user, I want to be able to input a shared question between the two topics, so that I can can compare how the two topics differ along the lines of this question.
- As a user, I need some kind of explicit or implicit submit mechanism (e.g. button or pressing Enter), so that I can request an LLM comparison along these topics.
- As a user, I want output fields for the results, so that I can see how LLMs responses vary across the two topics.
- As a user, I want a way to start over, so that I can start a new comparison

Use Typescript and ideally React, though if you choose to use a different framework, explain why.

## Bonus ideas

- Have multiple websites per topic.
- Compare multiple prompts.
- Compare different LLM models.
- Use LLMs to summarize the difference between the results.
- Ask multiple questions, either chat-style or in parallel.
- Permalink to a results page / or saving the results.
- Or take it into an interesting direction of your own 💡

# Submission

- Link to deployed website, or simple to follow instructions to deploy the code on localhost.
- Repo of your code with commit history - either in github or zip the whole folder and share the file. If sharing via github, please share with `mitko` and `spencermize`
- A short description of the result, could be over email, or in the readme, or a short video such as Loom.
- Optionally, we may end up on a quick debrief call about how it went.
- Optionally, include some examples of topics and prompts.

# Evaluation criteria

1. Gold points: Does the solution satisfy the minimum requirements?
2. Silver points: Usability, code quality, performance, design, reliability
3. Creativity points: any of the bonus ideas, or your own use case

# Example

Topic: Apples. Websites: https://en.m.wikipedia.org/wiki/Apple or https://www.britannica.com/plant/apple-fruit-and-tree

Topic Oranges. Websites: [https://en.m.wikipedia.org/wiki/Orange_(fruit)](https://en.m.wikipedia.org/wiki/Orange_(fruit))

Prompts: What does this fruit taste like? Where did this fruit originate from?

# Hints

- Next.js is a great, easy to get started with web framework. And it can be easily deployed to Vercel for free by pushing code. But you’re welcome to use a different framework if you prefer.
- Hooks in React make the code simpler and shorter.
- Convex.dev is an easy to use free backend as a service which you can use instead of a database.
- There are libraries out there which make it easy to extract plain text from a webpage.
- Use a cheap model, model/result quality is not an important evaluation factor.
- We can provide an OpenAI API Key if needed.