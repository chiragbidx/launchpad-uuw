import express from "express";
import next from "next";
import {
  getAvailableActions,
  isExecutionRunning,
  resolveCommand,
  runCommand,
} from "./commandRunner.js";

const app = express();
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 8080);
const forceDev = process.env.NEXT_DEV !== "false";
const nextApp = next({ dev: forceDev, hostname: host, port });
const nextHandler = nextApp.getRequestHandler();

function authenticate(req, res, next) {
  const configuredToken = process.env.RUN_TOKEN;
  if (!configuredToken) {
    return res.status(500).json({
      success: false,
      error: "Server misconfiguration: RUN_TOKEN is not set",
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid Authorization header",
    });
  }

  const providedToken = authHeader.slice("Bearer ".length).trim();
  if (providedToken !== configuredToken) {
    return res.status(403).json({
      success: false,
      error: "Invalid token",
    });
  }

  next();
}

app.post("/run", express.json(), authenticate, async (req, res) => {
  const action = req.body?.action;
  const args = req.body?.args;

  if (typeof action !== "string" || action.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Request body must include a non-empty string field: action (command name)",
    });
  }

  if (args !== undefined && !Array.isArray(args)) {
    return res.status(400).json({
      success: false,
      error: "If provided, args must be an array of strings",
    });
  }

  if (Array.isArray(args) && args.some((item) => typeof item !== "string")) {
    return res.status(400).json({
      success: false,
      error: "args must only contain strings",
    });
  }

  if (isExecutionRunning()) {
    return res.status(409).json({
      success: false,
      error: "Another command is currently running",
    });
  }

  try {
    const commandConfig = resolveCommand(action, args);
    const result = await runCommand(commandConfig);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    if (error.code === "INVALID_COMMAND") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.code === "COMMAND_BUSY") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    console.error(`[server] Unexpected error while running action=${action}`, error);
    return res.status(500).json({
      success: false,
      error: "Unexpected error while executing command",
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    running: isExecutionRunning(),
    mappedActions: getAvailableActions(),
    dynamicActionsEnabled: true,
  });
});

app.all("*", (req, res) => {
  return nextHandler(req, res);
});

async function start() {
  await nextApp.prepare();
  app.listen(port, host, () => {
    console.log(
      `[server] Unified server listening on ${host}:${port} (nextDev=${forceDev})`,
    );
  });
}

start().catch((error) => {
  console.error("[server] Failed to start unified server", error);
  process.exit(1);
});
