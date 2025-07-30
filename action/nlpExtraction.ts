"use server"
import nlp from "compromise";
import { parse, differenceInMonths } from 'date-fns';

export async function nlpExtraction(dataText: string): Promise<Record<string, string>> {
    const cleanedText = cleanResumeText(dataText);
    const skills = extractSkills(cleanedText);
    const enhancedSkills = enhanceSkillsWithNLP(skills || "");
    const experience = extractExperience(cleanedText);
    const experienceDuration = await calculateTotalExperience(experience);

    const result: Record<string, string> = {
        Skills: skills || enhancedSkills || "Skills not found",
        Experience: experienceDuration || "Experience not found"
    };

    return result;
}

// Extract only the Skills section (from heading to next known heading)
function extractSkills(dataText: string): string | null {
    const sectionHeadings = [
        "Skills", "Education", "Experience", "Projects", "Certifications",
        "Summary", "Work History", "Volunteer", "Awards"
    ];

    return extractSectionContent(dataText, "Skills", sectionHeadings);
}

// Extract only the Experience section (from heading to next known heading)
function extractExperience(dataText: string): string | null {
    const sectionHeadings = [
        "Skills", "Education", "Experience", "Projects", "Certifications",
        "Summary", "Work History", "Volunteer", "Awards"
    ];

    return extractSectionContent(dataText, "Experience", sectionHeadings);
}

// Extract text between the given heading and the next heading
function extractSectionContent(dataText: string, heading: string, sectionHeadings: string[]): string | null {
    const lowerText = dataText.toLowerCase();
    const lowerHeading = heading.toLowerCase();

    const startIndex = lowerText.indexOf(lowerHeading);
    if (startIndex === -1) return null;

    let sectionText = dataText.substring(startIndex + heading.length).trim();

    const nextSectionIndex = sectionHeadings
        .map(section => section.toLowerCase())
        .filter(section => section !== lowerHeading)
        .map(section => sectionText.toLowerCase().indexOf(section))
        .filter(index => index !== -1)
        .sort((a, b) => a - b)[0];

    if (nextSectionIndex !== undefined) {
        sectionText = sectionText.substring(0, nextSectionIndex).trim();
    }

    return sectionText;
}

// Clean the resume text
function cleanResumeText(text: string): string {
    return text
        .replace(/.*?:\s*/g, '')
        .replace(/(\D)(\d)/g, '$1 $2')
        .replace(/([a-zA-Z])([+|-])(\d)/g, '$1 $2$3')
        .replace(/([a-zA-Z])([.])([A-Z])/g, '$1$2 $3')
        .replace(/\|/g, ' | ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Enhance skills using NLP (compromise), though it's primarily regex-driven
function enhanceSkillsWithNLP(skillsText: string): string {
    if (!skillsText) return "";

    const doc = nlp(skillsText);

    const techTerms = doc
        .match('#TitleCase+')
        .out('array');

    const skillKeywords = [
        "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust",
        "PHP", "Swift", "Kotlin", "SQL", "HTML", "CSS", "React", "Angular", "Vue", "Node.js",
        "Express", "Django", "Flask", "Spring", "Rails", "TensorFlow", "PyTorch"
    ];

    const matchedSkills = [
        ...techTerms,
        ...skillKeywords.filter(skill => skillsText.includes(skill))
    ];

    const uniqueSkills = new Set(matchedSkills);

    return Array.from(uniqueSkills).join(', ');
}

function parseDate(dateStr: string): Date {
    if (dateStr === 'Present') return new Date();
    if (/^\d{4}$/.test(dateStr)) return parse(`${dateStr}-01`, 'yyyy-MM', new Date());
    return parse(dateStr, 'MMMM yyyy', new Date());
}

export async function calculateTotalExperience(experienceText: string | null): Promise<string | null> {
    if (!experienceText) return null;

    // Normalize dashes and "to" into hyphens
    const normalized = experienceText
        .replace(/–|—/g, '-')
        .replace(/\s+to\s+/gi, '-');

    // Match date ranges like "Jan 2020 - Feb 2022", "2019 - Present", etc.
    const dateRangeRegex = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\d{4})\s*-\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|Present|\d{4})/gi;

    const matches = normalized.matchAll(dateRangeRegex);

    let totalMonths = 0;

    for (const match of matches) {
        const startStr = match[1];
        const endStr = match[3];

        const startDate = parseDate(startStr);
        const endDate = parseDate(endStr);

        const months = differenceInMonths(endDate, startDate);
        if (!isNaN(months)) {
            totalMonths += months;
        }
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const yearStr = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    const monthStr = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';

    return [yearStr, monthStr].filter(Boolean).join(' ') || '0 months';
}
