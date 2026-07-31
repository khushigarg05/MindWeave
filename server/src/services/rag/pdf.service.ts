import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractPdfText(filePath: string) {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  return docs.map((doc) => doc.pageContent).join("\n");
}