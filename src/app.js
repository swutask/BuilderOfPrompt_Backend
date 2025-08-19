import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors());

// Handling Raw Body Routes
import webhookRoutes from "./routes/webhook.routes.js";

app.use("/api/v1/webhook", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static("public"));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running.");
});

import userRoutes from "./routes/user.routes.js";
import builderRoutes from "./routes/builder.routes.js";
import promptRoutes from "./routes/prompt.routes.js";
import mooodRoutes from "./routes/mood.routes.js";
import linkRoutes from "./routes/link.routes.js";

import imageGeneratorRoutes from "./routes/imageGenerator.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/builder", builderRoutes);
app.use("/api/v1/prompt", promptRoutes);
app.use("/api/v1/mood", mooodRoutes);
app.use("/api/v1/image-generator", imageGeneratorRoutes);
app.use("/api/v1/link-generate", linkRoutes);

export default app;
