import { NextRequest, NextResponse} from "next/server";
import {Client} from "@gradio/client";


export   async function  POST(req: NextRequest)  {
    try {
        const { imageUrl, prompt } = await req.json();

        const imageRes = await fetch(imageUrl);
        const imageBlob = await imageRes.blob();

        const client = await Client.connect("MauryaVivek/ai-room-planner");

        const result = await client.predict("/predict", {
            input_image : imageBlob,
            prompt,
        });
              // Type assertion to fix 'unknow error'
        const data = result.data as {
            url : string;
            path: string;
        }[];

        const imgSrc = data?.[0]?.url;

        return NextResponse.json({ image : imgSrc });

    } catch (error) {
        console.error("Generate Error:", error);
       return NextResponse.json(
        {error: "Failed to generate image"},
        {status: 500}
       ); 
    }
};

