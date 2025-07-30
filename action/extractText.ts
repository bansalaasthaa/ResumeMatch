"use server"
import { readFile } from "fs/promises";
import pdfParse from "pdf-parse"
import mammoth from "mammoth";
import { extname } from "path";
import { nlpExtraction } from "./nlpExtraction";

export async function extractText(tempPath: string): Promise<Record<string,string>>{
    try {
        const fileExtension = extname(tempPath).toLowerCase();

        if (fileExtension === ".pdf") {
            const dataText = await extractTextFromPDF(tempPath);
            return await nlpExtraction(dataText);
        } else if (fileExtension === ".docx") {
            const dataText =  await extractTextFromDOCX(tempPath);
            return await nlpExtraction(dataText);
            
        } else {
            throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
        }
    } catch (error) {
        console.error("Error extracting text:", error);
        return {message : "An error occured"};
    }
}

//Extract text from a PDF using `pdf-parse`
async function extractTextFromPDF(tempPath: string): Promise<string> {
    try {
        const fileBuffer = await readFile(tempPath);
        const data = await pdfParse(fileBuffer);
        return data.text.trim();
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        return "Error extracting text from PDF.";
    }
}

//Extract text from a DOCX file
async function extractTextFromDOCX(tempPath: string): Promise<string> {
    try {
        const fileBuffer = await readFile(tempPath);
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value.trim();
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        return "Error extracting text from DOCX.";
    }
}
