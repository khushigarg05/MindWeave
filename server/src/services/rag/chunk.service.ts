import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// =======================================================
// Split Document Into Chunks
// =======================================================

export async function splitIntoChunks(
  text: string
) {

  // =======================================================
  // Text Splitter Configuration
  // =======================================================

  const splitter =
    new RecursiveCharacterTextSplitter({

      // Larger chunks help preserve complete
      // policy sections from the handbook.

      chunkSize: 2000,

      // Keep surrounding context between chunks.

      chunkOverlap: 400,

      // Prefer natural document boundaries.

      separators: [
        "\n\n",
        "\n",
        ". ",
        " ",
        "",
      ],

    });


  // =======================================================
  // Create Documents
  // =======================================================

  const chunks =
    await splitter.createDocuments([
      text,
    ]);


  // =======================================================
  // Chunking Debug Information
  // =======================================================

  console.log(
    "===================================="
  );

  console.log(
    "CHUNKING COMPLETE"
  );

  console.log(
    "Original Characters:",
    text.length
  );

  console.log(
    "Total Chunks:",
    chunks.length
  );

  console.log(
    "Chunk Size: 2000"
  );

  console.log(
    "Chunk Overlap: 400"
  );

  console.log(
    "===================================="
  );


  // =======================================================
  // Print Every Chunk
  // =======================================================

  chunks.forEach(
    (chunk, index) => {

      console.log(
        `\n========== CHUNK ${index + 1} ==========`
      );

      console.log(
        "Characters:",
        chunk.pageContent.length
      );

      console.log(
        chunk.pageContent.substring(
          0,
          800
        )
      );

      console.log(
        "------------------------------------"
      );

    }
  );


  // =======================================================
  // Return Chunks
  // =======================================================

  return chunks;

}