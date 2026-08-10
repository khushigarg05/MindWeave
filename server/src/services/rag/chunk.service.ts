import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


export async function splitIntoChunks(text: string) {

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 300,

      separators: [
        "\n\n",
        "\n",
        ". ",
        " ",
        "",
      ],
    });


  const chunks =
    await splitter.createDocuments([text]);


  console.log("====================================");
  console.log("CHUNKING COMPLETE");
  console.log("Total Chunks:", chunks.length);
  console.log("====================================");


  chunks.forEach((chunk, index) => {

    console.log(
      `\n========== CHUNK ${index + 1} ==========`
    );

    console.log(
      chunk.pageContent.substring(0, 500)
    );

    console.log(
      "------------------------------------"
    );

  });


  return chunks;
}