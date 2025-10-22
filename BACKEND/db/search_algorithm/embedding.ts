import OpenAI from "openai";
const openai = new OpenAI({apiKey:"XXX"})

// Function to normalize a vector to its L2 norm
function normalizeL2(x: number[] | number[][]): number[] | number[][] {
    if (Array.isArray(x[0])) {
      // x is a 2D array
      const array2D = x as number[][];
      return array2D.map((row) => {
        const norm = Math.sqrt(row.reduce((sum, val) => sum + val * val, 0));
        return norm === 0 ? row : row.map((val) => val / norm);
      });
    } else {
      // x is a 1D array
      const array1D = x as number[];
      const norm = Math.sqrt(array1D.reduce((sum, val) => sum + val * val, 0));
      return norm === 0 ? array1D : array1D.map((val) => val / norm);
    }
  }
  
// Function to get the embedding of a text and normalize it
export async function getEmbedding(text: string, model: string = "text-embedding-3-large"): Promise<number[]> {
// Replace newlines with spaces
const cleanedText = text.replace(/\n/g, " ");

// Assuming `client.embeddings.create` is an async function that returns the embedding data
const response = await openai.embeddings.create({
    input: [cleanedText],
    model: model,
});

// Take the first 256 dimensions of the embedding and normalize it
const embedding = response.data[0].embedding.slice(0, 256);
return normalizeL2(embedding) as number[];
}