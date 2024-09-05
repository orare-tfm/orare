require("dotenv").config(); // Cargar variables de entorno desde .env.local

const express = require("express");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");
const cors = require("cors");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Obtener variables de entorno
const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;
const port = process.env.PORT;

// Configurar el driver de Neo4j

const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);
const session = driver.session();

app.post("/createUser", async (req, res) => {
  const { userId, email, postalCode, address, church } = req.body;
  try {
    const result = await session.run(
      `MATCH (c:Church {parroquia: $church})
       MERGE (u:User {userId: $userId})
       ON CREATE SET u.postalCode = $postalCode, u.address = $address, u.email = $email, u.userId = $userId
       MERGE (u)-[:GOES_TO]->(c)
       WITH u, c
       OPTIONAL MATCH (e:Event)
       WHERE e.postalCode = u.postalCode
       FOREACH (event IN CASE WHEN e IS NOT NULL THEN [e] ELSE [] END |
         MERGE (u)-[:INTERESTED_IN]->(event)
       )
       RETURN u;`,
      { userId, email, postalCode, address, church }
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

app.get("/getChurch", async (req, res) => {
  const uId = req.query.name;
  // Check if the data is in the cache
  const cachedData = cache.get(uId);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const result = await session.run(
      `
      MATCH (c:Church)<-[:GOES_TO]-(u:User {userId: $uId})
      OPTIONAL MATCH (u)-[:INTERESTED_IN]->(ownEvent:Event)
      WHERE date(ownEvent.date) >= date()
      OPTIONAL MATCH (c)<-[:GOES_TO]-(otherUser:User)-[:INTERESTED_IN]->(otherEvent:Event)
      WHERE otherUser <> u AND date(otherEvent.date) >= date()
      MATCH (allEvent:Event)
      WHERE date(allEvent.date) >= date()
      RETURN c.horario_de_misas AS horarioDeMisas,
       collect(DISTINCT {
         title: allEvent.title,
         date: allEvent.date,
         hour: allEvent.hour,
         location: allEvent.location,
         title_description: allEvent.title_description,
         image: allEvent.image,
         url: allEvent.url,
         postalCode: allEvent.postalCode
       }) AS allEvents,
       collect(DISTINCT  {
         title: ownEvent.title,
         date: ownEvent.date,
         hour: ownEvent.hour,
         location: ownEvent.location,
         title_description: ownEvent.title_description,
         image: ownEvent.image,
         url: ownEvent.url,
         postalCode: ownEvent.postalCode
       }) AS ownEvents,
       collect(DISTINCT {
         title: otherEvent.title,
         date: otherEvent.date,
         hour: otherEvent.hour,
         location: otherEvent.location,
         title_description: otherEvent.title_description,
         image: otherEvent.image,
         url: otherEvent.url,
         postalCode: otherEvent.postalCode
       }) AS otherEvents
      `,
      { uId }
    );

    const response = result.records.map((record) => ({
      horarioDeMisas: record.get("horarioDeMisas") || [],
      ownEvents: record
        .get("ownEvents")
        .filter((event) => event.title !== null),
      otherEvents: record
        .get("otherEvents")
        .filter((event) => event.title !== null),
      allEvents: record.get("allEvents"),
    }));
    // Cache the response data for future requests
    cache.set(uId, response[0]);
    res.json(response[0]);
  } catch (error) {
    console.error("Error fetching church data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching church data." });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3002");
});
