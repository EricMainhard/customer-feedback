import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action = async ({ request }) => {
  const formData = await request.json();

  try {
    if (Array.isArray(formData)) {
      // Use Prisma's createMany method for multiple entries
      const feedbacks = await prisma.feedback.createMany({
        data: formData.map(({ firstName, lastName, comment }) => ({
          firstName,
          lastName,
          feedback: comment,
        })),
      });

      return json(
        { feedbacks, success: true },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    } else {
      const { firstName, lastName, comment } = formData;

      const feedback = await prisma.feedback.create({
        data: {
          firstName,
          lastName,
          feedback: comment,
        },
      });

      return json(
        { feedback, success: true },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing form data:", error);
    return json(
      { error: error.message },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
};

export const loader = async ({ request }) => {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return json(
      { feedbacks },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error("Error loading feedbacks:", error);
    return json(
      { error: error.message },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
};
