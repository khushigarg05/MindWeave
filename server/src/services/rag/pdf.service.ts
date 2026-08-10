import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractPdfText(filePath: string) {
  const loader = new PDFLoader(filePath, {
    parsedItemSeparator: " ",
  });

  const docs = await loader.load();

  console.log("====================================");
  console.log("PDF PAGES EXTRACTED:", docs.length);
  console.log("====================================");

  const pageTexts = docs.map((doc, index) => {
    let text = doc.pageContent;

    // ==========================================
    // Clean extracted text
    // ==========================================

    text = text
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log(
      `\n========== PAGE ${index + 1} ==========`
    );

    console.log(text.substring(0, 1500));

    return text;
  });

  // ==========================================
  // Combine all pages
  // ==========================================

  const fullText = pageTexts.join("\n\n");

  console.log("====================================");
  console.log("TOTAL EXTRACTED CHARACTERS:", fullText.length);
  console.log("====================================");

  return fullText;
}