import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action = async ({ request }) => {

    const formData = await request.json();
    const { firstName, lastName, comment } = formData;
    
    const feedback = await prisma.feedback.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            feedback: comment,
          },
    });
    
    return json(
        { 
            firstName,
            lastName,
            comment,
            success: true
        },
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }
    );
};

export const loader = async ({ request }) => {
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
};