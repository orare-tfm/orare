/**
 * @file  src/lib/embeddings.ts
 * @description
 * This module is called from src/lib/pinecone.ts through embedPray
 * it recieves the last User's message from Diario and it's vectorized
 * using "text-embedding-3-small" model from OpenAI
 * @date 09/08/2024
 * @maintainer Orare Team
 * @inputs
 * - message: Last user's message from Diario Component
 * @outputs
 * - Returns a queryResponse with the 3 most similar vectors from Pinecone
 * Index "bible-verses-metadata" and Namespace "Content"
 * @dependencies
 * - Pinecone for performing comparison related to Bible interpreted.
 * - getEmbeddings for retrieve message vectorized
 */

import { Configuration, OpenAIApi } from "openai-edge";

// Create OpenAI Connection
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Getting the User's Message Vectorized with the model
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small", // Model Selected
      input: text.replace(/\n/g, " "), // Replace line breaks
    });
    const responseData = await response.json();
    return responseData.data[0].embedding as number[];
  } catch (error) {
    console.error("Error llamando a la API de embeddings de OpenAI", error);
    throw error;
  }
}
