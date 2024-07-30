import { json } from "@remix-run/node";
import { OpenAI, Configuration } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAI(configuration);

export const action = async ({ request }) => {
  const formData = await request.json();

  console.log('...formData', formData);
};

export const loader = async ({ request }) => {
    return request
};
