"use server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { extractText } from "./extractText";
 
export default async function handleResume(resume: File): Promise<Record<string, string>> {
    try {
        // Convert File to Buffer
        const fileBuffer = await resume.arrayBuffer();
        const tempPath = join("/tmp", resume.name);

        // Save the uploaded file temporarily
        await writeFile(tempPath, Buffer.from(fileBuffer));
        
        // Extract text using the NLP function
        const extractedData = await extractText(tempPath);

        // Ensure the return type is correctly formatted
        if (typeof extractedData === "string") {
            return { message: extractedData }; 
        } else if (typeof extractedData === "object") {
            return extractedData as Record<string, string>; 
        } else {
            return { message: "Unexpected data format from extraction" };
        }
    } catch (error) {
        console.error("Error processing resume:", error);
        return { message: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}
 