export type LogLevel = "info" | "warn" | "error" | "success";

export function log(level: LogLevel, message: string): void {
  const stream = level === "error" ? process.stderr : process.stdout;
  const prefix =
    level === "error" ? "❌" : level === "warn" ? "⚠" : level === "success" ? "✅" : "·";
  stream.write(`${prefix} ${message}\n`);
}

export function step(emoji: string, message: string): void {
  process.stdout.write(`${emoji} ${message}\n`);
}

export function blank(): void {
  process.stdout.write("\n");
}
