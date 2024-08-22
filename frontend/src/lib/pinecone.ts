/**
 * @file  src/lib/pinecone.ts
 * @description
 * This module is called from /api/chat-pry/route.ts through comparePrayInPinecone
 * it recieves the last User's message from Diario and it's vectorized 
 * with getEmbeddings trhough embedPray function returning a vector (array)
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

import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings } from "../lib/embeddings"

// Create Pinecone Connection
let pc: Pinecone | null = null;
export const getPineconeClient = async () => {
  if (!pc) {
    pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  }
  return pc;
};

// Encoding with getEbeddings the last message from User in Diario (Component)
async function embedPray(prayerContent: string) {
    try {
      const embeddings = await getEmbeddings(prayerContent);
      return embeddings;
    } catch (error) {
      console.error("Error vectorizando oración de usuario!", error);
      throw error;
    }
  }

// Comparing User's Message Vectorized with Bible Interpreted Vectorized 
export async function comparePrayInPinecone(pray: string) {
  if (!pray) {
    throw new Error("Usuario no ingresó oración.");
  }

  // Vecotizing User's Message 
  const embedding = await embedPray(pray);

  // Connecting to our Index in Pinecone 
  const pinecone = await getPineconeClient();
  const index = pinecone.Index("bible-verses-metadata");
  const space = "content"

  // Comparing Vectors 
  try {
    const queryResponse = await index.namespace(space).query({
      vector: embedding,
      topK: 3, // Return 3 Top Similar 
      includeMetadata: true, 
      includeValues: true,
    });

    // Processing Results
    if (queryResponse.matches?.length) {
      return queryResponse.matches.map((match) => ({
        id: match.id,
        score: match.score,
        metadata: {
          area_vida: match.metadata?.area_vida ?? "No disponible",
          interpretacion: match.metadata?.interpretacion ?? "No disponible",
          pasaje: match.metadata?.pasaje ?? "No disponible",
          temas: match.metadata?.temas ?? "No disponible",
          texto: match.metadata?.texto ?? "No disponible",
        },
      }));
    } else {
      console.log("No se encontraron coincidencias con nuestro Index de Pinecone");
      return [];
    }
  } catch (error) {
    console.error("Error al comparar la oración en Pinecone:", error);
    throw error;
  }
}


