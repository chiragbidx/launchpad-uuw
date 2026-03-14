import { spawn } from "node:child_process";

const COMMAND_TIMEOUT_MS = 60_000;

const COMMANDS = {
  install_dependencies: {
    cmd: "npm",
    args: ["install"],
  },
  build: {
    cmd: "npm",
    args: ["run", "build"],
  },
  start_dev: {
    cmd: "npm",
    args: ["run", "dev"],
  },
  list_files: {
    cmd: "ls",
    args: ["-la"],
  },
};

let isRunning = false;
const NPM_BUILTIN_COMMANDS = new Set([
  "access",
  "adduser",
  "audit",
  "bugs",
  "cache",
  "ci",
  "config",
  "dedupe",
  "deprecate",
  "dist-tag",
  "docs",
  "doctor",
  "edit",
  "exec",
  "explain",
  "explore",
  "find-dupes",
  "fund",
  "help",
  "help-search",
  "hook",
  "init",
  "install",
  "install-ci-test",
  "install-test",
  "link",
  "ll",
  "login",
  "logout",
  "ls",
  "org",
  "outdated",
  "owner",
  "pack",
  "ping",
  "pkg",
  "prefix",
  "profile",
  "prune",
  "publish",
  "query",
  "rebuild",
  "repo",
  "restart",
  "root",
  "run",
  "run-script",
  "sbom",
  "search",
  "set",
  "shrinkwrap",
  "star",
  "stars",
  "start",
  "stop",
  "team",
  "test",
  "token",
  "uninstall",
  "unpublish",
  "unstar",
  "update",
  "version",
  "view",
  "whoami",
]);

export function getAvailableActions() {
  return Object.keys(COMMANDS);
}

export function isExecutionRunning() {
  return isRunning;
}

function parseCommandLine(commandLine) {
  const tokens = [];
  let current = "";
  let quote = null;
  let escaping = false;

  for (const char of commandLine) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }

    if (char === "\\") {
      escaping = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (escaping || quote) {
    const error = new Error("Invalid command string: unmatched escape or quote");
    error.code = "INVALID_COMMAND";
    throw error;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

function normalizeCommand(cmd, args) {
  if (cmd !== "npm" || args.length === 0) {
    return { cmd, args };
  }

  const [firstArg, ...rest] = args;
  if (firstArg.startsWith("-")) {
    return { cmd, args };
  }

  if (NPM_BUILTIN_COMMANDS.has(firstArg)) {
    return { cmd, args };
  }

  return { cmd, args: ["run", firstArg, ...rest] };
}

export function resolveCommand(action, args) {
  const normalizedAction = action.trim();

  if (COMMANDS[normalizedAction]) {
    return {
      actionLabel: normalizedAction,
      cmd: COMMANDS[normalizedAction].cmd,
      args: COMMANDS[normalizedAction].args,
      source: "mapped",
    };
  }

  if (Array.isArray(args)) {
    const normalized = normalizeCommand(normalizedAction, args);
    return {
      actionLabel: normalizedAction,
      cmd: normalized.cmd,
      args: normalized.args,
      source: "dynamic",
    };
  }

  const parsed = parseCommandLine(normalizedAction);
  if (parsed.length === 0) {
    const error = new Error("Invalid command string");
    error.code = "INVALID_COMMAND";
    throw error;
  }

  const normalized = normalizeCommand(parsed[0], parsed.slice(1));
  return {
    actionLabel: normalizedAction,
    cmd: normalized.cmd,
    args: normalized.args,
    source: "dynamic",
  };
}

export function runCommand(commandConfig) {
  const { actionLabel, cmd, args } = commandConfig;

  if (isRunning) {
    const error = new Error("Another command is already running");
    error.code = "COMMAND_BUSY";
    throw error;
  }

  isRunning = true;
  const startedAt = new Date();
  const startedAtIso = startedAt.toISOString();
  console.log(
    `[runner] START action=${actionLabel} cmd=${cmd} args=${JSON.stringify(args)} at=${startedAtIso}`,
  );

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let forceKillTimer = null;

    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timeoutTimer = setTimeout(() => {
      timedOut = true;
      stderr += `Command timed out after ${COMMAND_TIMEOUT_MS}ms`;
      console.error(`[runner] TIMEOUT action=${actionLabel} after=${COMMAND_TIMEOUT_MS}ms`);
      child.kill("SIGTERM");

      forceKillTimer = setTimeout(() => {
        if (!child.killed) {
          console.error(`[runner] FORCE_KILL action=${actionLabel}`);
          child.kill("SIGKILL");
        }
      }, 5_000);
    }, COMMAND_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(`[runner:${actionLabel}:stdout] ${text}`);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(`[runner:${actionLabel}:stderr] ${text}`);
    });

    child.on("error", (error) => {
      clearTimeout(timeoutTimer);
      if (forceKillTimer) {
        clearTimeout(forceKillTimer);
      }

      const endedAt = new Date();
      console.error(
        `[runner] ERROR action=${actionLabel} at=${endedAt.toISOString()} message=${error.message}`,
      );
      isRunning = false;
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timeoutTimer);
      if (forceKillTimer) {
        clearTimeout(forceKillTimer);
      }

      const endedAt = new Date();
      const durationMs = endedAt.getTime() - startedAt.getTime();
      console.log(
        `[runner] END action=${actionLabel} at=${endedAt.toISOString()} durationMs=${durationMs} code=${code} signal=${signal ?? "none"} timedOut=${timedOut}`,
      );

      isRunning = false;

      resolve({
        success: !timedOut && code === 0,
        stdout,
        stderr,
        code,
        signal,
        timedOut,
        startedAt: startedAtIso,
        endedAt: endedAt.toISOString(),
        durationMs,
      });
    });
  });
}
