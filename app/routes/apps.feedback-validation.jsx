import { json } from "@remix-run/node";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
    project: process.env.OPENAI_PROJECT_ID,
});

async function main(feedback) {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are an assistant that evaluates customer feedback. Your goal is to determine if the feedback is useful and relevant for improving our products and services." },
            { role: "user", content: `Please analyze and determine if this is a usefull and valid feedback: ${feedback} In case it is, please return TRUE, if not return FALSE.` },
        ],
        model: "gpt-4o-mini",
    });
  
    console.log(completion?.choices[0]?.message?.content);
    return completion?.choices[0]?.message?.content;
}

export const action = async ({ request }) => {
    try {
      const formData = await request.json();
      const { comment } = formData;
      const result = await main(comment);
      return json({ message: result });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  };

export const loader = async ({ request }) => {
    return request
};