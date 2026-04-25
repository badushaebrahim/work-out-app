import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// Read the reference style image once at startup
const refImagePath = path.join(process.cwd(), 'public', 'workingoutuser.png');
let refImageBase64: string | null = null;

function getRefImage(): string {
  if (!refImageBase64) {
    const buf = fs.readFileSync(refImagePath);
    refImageBase64 = buf.toString('base64');
  }
  return refImageBase64;
}

export async function POST(req: Request) {
  try {
    const { name, category, type, executionSteps } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Exercise name is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const stepsText = executionSteps?.length
      ? `The exercise execution steps are: ${executionSteps.join(', ')}.`
      : '';

    const stylePrompt = `You are an expert fitness illustrator. Generate an exercise demonstration image in this EXACT art style: a 3D wireframe/mesh human figure with teal/cyan glowing edges on a dark black-gray background. The figure should be muscular, anatomically detailed with visible wireframe polygon mesh lines, and have subtle teal glow highlights. The background should be very dark (near black) with subtle gradient lighting from below.

The figure must be performing the exercise: "${name}" (Category: ${category}, Type: ${type}).
${stepsText}

Show the figure in the ACTIVE/MID-MOVEMENT position of this exercise with proper form. The wireframe mesh style must match the reference image exactly — no solid surfaces, just glowing wireframe edges forming the body shape. Include any relevant equipment (barbell, dumbbell, cable, etc.) also in wireframe style.

CRITICAL: Match the reference image style precisely — wireframe mesh figure, dark background, teal/cyan color palette.`;

    // Generate image with Gemini using reference image
    const refBase64 = getRefImage();

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/png',
                data: refBase64,
              },
            },
            {
              text: stylePrompt,
            },
          ],
        },
      ],
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract the generated image from response
    const parts = response?.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json({ message: 'No response from Gemini' }, { status: 500 });
    }

    let imageData: string | null = null;
    let mimeType = 'image/png';

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data!;
        mimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!imageData) {
      return NextResponse.json({ message: 'Gemini did not generate an image. Try again.' }, { status: 500 });
    }

    return NextResponse.json({
      imageBase64: imageData,
      mimeType,
    });
  } catch (error: any) {
    console.error('Gemini image generation error:', error);
    return NextResponse.json({ message: error.message || 'Image generation failed' }, { status: 500 });
  }
}
