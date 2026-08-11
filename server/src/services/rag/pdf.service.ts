import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// =======================================================
// Extract PDF Text
// =======================================================

export async function extractPdfText(
  filePath: string
) {
  console.log("====================================");
  console.log("STARTING PDF EXTRACTION");
  console.log("====================================");

  console.log("PDF:", filePath);

  const loader = new PDFLoader(filePath, {
    parsedItemSeparator: " ",
  });

  // =======================================================
  // Load PDF Pages
  // =======================================================

  const docs = await loader.load();

  console.log("====================================");
  console.log("PDF PAGES EXTRACTED:", docs.length);
  console.log("====================================");

  // =======================================================
  // Extract Each Page
  // =======================================================

  const pageTexts = docs.map((doc, index) => {
    // Keep the ORIGINAL extracted text first.
    const originalText = doc.pageContent;

    console.log(
      `\n========== RAW PAGE ${index + 1} ==========`
    );

    console.log(
      "Characters:",
      originalText.length
    );

    console.log(
      originalText.substring(0, 2000)
    );

    console.log(
      "=========================================="
    );

    // =====================================================
    // Important Keyword Debugging
    // =====================================================

    const lowerText =
      originalText.toLowerCase();

    const keywords = [
      "remote",
      "remotely",
      "maximum",
      "per year",
      "consecutive",
      "work from home",
      "holiday",
      "overtime",
      "non-exempt",
    ];

    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        console.log(
          `✅ Found "${keyword}" on page ${index + 1}`
        );
      }
    }

    // =====================================================
    // Clean Text Carefully
    // =====================================================

    let text = originalText;

    // Normalize Windows line endings
    text = text.replace(/\r\n/g, "\n");

    // Normalize remaining carriage returns
    text = text.replace(/\r/g, "\n");

    // Remove trailing spaces from each line
    text = text
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");

    // Remove excessive spaces/tabs
    text = text.replace(/[ \t]{2,}/g, " ");

    // Keep meaningful line breaks.
    // Only remove 3+ consecutive blank lines.
    text = text.replace(/\n{3,}/g, "\n\n");

    // Remove spaces at the beginning of lines
    text = text.replace(/\n[ \t]+/g, "\n");

    // Remove spaces immediately before line breaks
    text = text.replace(/[ \t]+\n/g, "\n");

    // Trim the page
    text = text.trim();

    // =====================================================
    // Cleaned Page Debug
    // =====================================================

    console.log(
      `\n========== CLEANED PAGE ${index + 1} ==========`
    );

    console.log(
      "Characters:",
      text.length
    );

    console.log(
      text.substring(0, 2000)
    );

    console.log(
      "=============================================="
    );

    return text;
  });

  // =======================================================
  // Combine All Pages
  // =======================================================

  const fullText = pageTexts
    .filter((text) => text.length > 0)
    .join("\n\n");

  // =======================================================
  // Final Debug
  // =======================================================

  console.log("====================================");
  console.log(
    "TOTAL EXTRACTED CHARACTERS:",
    fullText.length
  );
  console.log("====================================");

  // =======================================================
  // Check Important Sections
  // =======================================================

  const lowerFullText =
    fullText.toLowerCase();

  const importantTerms = [
    "work from home",
    "remote working",
    "remotely",
    "maximum",
    "per year",
    "consecutive weeks",
    "holiday",
    "overtime",
    "non-exempt",
  ];

  console.log(
    "\n========== IMPORTANT TERM CHECK =========="
  );

  for (const term of importantTerms) {
    console.log(
      `${term}: ${
        lowerFullText.includes(term)
          ? "✅ FOUND"
          : "❌ NOT FOUND"
      }`
    );
  }

  console.log(
    "=========================================="
  );

  // =======================================================
  // Show Relevant Remote-Working Context
  // =======================================================

  const remoteIndex =
    lowerFullText.indexOf("remote working");

  if (remoteIndex !== -1) {
    console.log(
      "\n========== REMOTE WORKING CONTEXT =========="
    );

    console.log(
      fullText.substring(
        Math.max(0, remoteIndex - 500),
        remoteIndex + 2500
      )
    );

    console.log(
      "============================================"
    );
  }

  // =======================================================
  // Show Relevant Holiday Context
  // =======================================================

  const holidayIndex =
    lowerFullText.indexOf("working on a holiday");

  if (holidayIndex !== -1) {
    console.log(
      "\n========== HOLIDAY CONTEXT =========="
    );

    console.log(
      fullText.substring(
        Math.max(0, holidayIndex - 500),
        holidayIndex + 2000
      )
    );

    console.log(
      "===================================="
    );
  }

  // =======================================================
  // Return Extracted Text
  // =======================================================

  return fullText;
}