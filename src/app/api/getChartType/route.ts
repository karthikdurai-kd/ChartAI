import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Get Chart Type from LLM for the csv data
export async function POST(req: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const { dataset } = await req.json();
    if (!dataset)
      return NextResponse.json(
        { error: "No dataset provided" },
        { status: 400 }
      );

    // Prompt for the LLM to get the chart type
    const prompt = `Given the dataset: ${JSON.stringify(
      dataset
    )}, which type of chart (Bar, Line, Pie, Scatter, etc...) best represents this data? Respond with the chart type only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return NextResponse.json({ chartType: response.text });
  } catch (error) {
    console.error("Error fetching chart type:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
