/**
 * Resource guard — prevents rclaw from crashing the machine.
 *
 * 5 safeguards:
 *  1. Render lock — only one render at a time (lockfile)
 *  2. Chrome memory limits — headless flags + heap cap
 *  3. Duration guard — reject videos > 60s without --force
 *  4. Concurrency cap — default 2, max 4
 *  5. Pre-render RAM check — abort if < 4 GB free
 */

import { existsSync, writeFileSync, mkdirSync, unlinkSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { platform } from 'process';

const LOCK_DIR = resolve(tmpdir(), 'rclaw-locks');
const LOCK_FILE = resolve(LOCK_DIR, 'render.lock');

// ── 1. Render Lock (one at a time) ─────────────────

/**
 * Acquire render lock. Returns a cleanup function.
 * Throws if another render is already running.
 */
export function acquireRenderLock() {
  if (!existsSync(LOCK_DIR)) mkdirSync(LOCK_DIR, { recursive: true });

  if (existsSync(LOCK_FILE)) {
    // Check if the PID in the lock is still alive
    try {
      const pid = parseInt(readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      // On macOS/Linux, kill -0 checks if process exists
      execSync(`kill -0 ${pid} 2>/dev/null`, { stdio: 'ignore' });
      // Process still alive — lock is held
      throw new Error(
        `Another rclaw render is already running (PID ${pid}).\n` +
        `Wait for it to finish, or remove the lock file:\n` +
        `  rm ${LOCK_FILE}`
      );
    } catch (e) {
      if (e.message.includes('Another rclaw render')) throw e;
      // PID dead — stale lock, remove it
      try { unlinkSync(LOCK_FILE); } catch {}
    }
  }

  writeFileSync(LOCK_FILE, process.pid.toString());

  // Return cleanup function
  return () => {
    try { unlinkSync(LOCK_FILE); } catch {}
  };
}

// ── 2. Chrome Memory Limits ────────────────────────

/**
 * Chrome flags to cap memory usage.
 */
export function getChromeFlags() {
  return [
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--js-flags=--max-old-space-size=512',
  ];
}

// ── 3. Duration Guard ──────────────────────────────

const MAX_DURATION_DEFAULT = 60; // seconds

/**
 * Check if duration is within safe limits.
 * Returns { ok, duration, forced }
 */
export function checkDuration(durationSec, force = false) {
  if (durationSec <= MAX_DURATION_DEFAULT) {
    return { ok: true, duration: durationSec, forced: false };
  }

  if (force) {
    console.log(`⚠️  Duration ${durationSec}s exceeds ${MAX_DURATION_DEFAULT}s limit (forced with --force)`);
    return { ok: true, duration: durationSec, forced: true };
  }

  return {
    ok: false,
    duration: durationSec,
    forced: false,
    error: `Duration ${durationSec}s exceeds safe limit of ${MAX_DURATION_DEFAULT}s.\n` +
      `Long renders use significant memory. Use --force to override.`,
  };
}

// ── 4. Concurrency Cap ─────────────────────────────

const DEFAULT_CONCURRENCY = 2;
const MAX_CONCURRENCY = 4;

/**
 * Clamp concurrency to safe range.
 */
export function clampConcurrency(concurrency) {
  if (!concurrency) return DEFAULT_CONCURRENCY;
  const n = parseInt(concurrency, 10);
  if (isNaN(n) || n < 1) return 1;
  if (n > MAX_CONCURRENCY) {
    console.log(`⚠️  Concurrency ${n} capped to ${MAX_CONCURRENCY} (max safe limit)`);
    return MAX_CONCURRENCY;
  }
  return n;
}

// ── 5. Pre-render RAM Check ────────────────────────

const MIN_FREE_RAM_GB = 4;

/**
 * Get available free RAM in GB.
 */
function getFreeRamGB() {
  if (platform === 'darwin') {
    try {
      const output = execSync('vm_stat', { encoding: 'utf8' });
      const pageSize = 4096; // macOS default page size
      const freeMatch = output.match(/Pages free:\s+(\d+)/);
      const inactiveMatch = output.match(/Pages inactive:\s+(\d+)/);
      if (freeMatch && inactiveMatch) {
        const freePages = parseInt(freeMatch[1], 10);
        const inactivePages = parseInt(inactiveMatch[1], 10);
        return ((freePages + inactivePages) * pageSize) / (1024 ** 3);
      }
    } catch {}
    // Fallback: use sysctl
    try {
      const output = execSync('sysctl -n hw.memsize', { encoding: 'utf8' });
      return (parseInt(output.trim(), 10) / (1024 ** 3)) * 0.3; // rough 30% estimate
    } catch {}
  }

  if (platform === 'linux') {
    try {
      const output = execSync('free -gb', { encoding: 'utf8' });
      const match = output.match(/Mem:\s+\d+\s+\d+\s+(\d+)/);
      if (match) return parseInt(match[1], 10);
    } catch {}
  }

  // Unknown platform — skip check
  return Infinity;
}

/**
 * Check if there's enough free RAM to render safely.
 * Returns { ok, freeGB } or { ok: false, freeGB, error }
 */
export function checkRam() {
  const freeGB = getFreeRamGB();

  if (freeGB < MIN_FREE_RAM_GB) {
    return {
      ok: false,
      freeGB: Math.round(freeGB * 10) / 10,
      error: `Only ${freeGB.toFixed(1)} GB free RAM (need ${MIN_FREE_RAM_GB} GB).\n` +
        `Rendering may crash your machine. Free up memory or close other apps first.`,
    };
  }

  return { ok: true, freeGB: Math.round(freeGB * 10) / 10 };
}

// ── Combined Pre-flight Check ──────────────────────

/**
 * Run all pre-render safety checks. Returns a cleanup function on success.
 * Throws on failure.
 */
export function preflight(options = {}) {
  const force = options.force || false;

  // 5. RAM check
  const ram = checkRam();
  if (!ram.ok) {
    if (force) {
      console.log(`⚠️  RAM warning: ${ram.error}`);
    } else {
      throw new Error(ram.error + '\nUse --force to override.');
    }
  } else {
    console.log(`✅ RAM: ${ram.freeGB} GB free`);
  }

  // 3. Duration check
  if (options.duration) {
    const dur = checkDuration(options.duration, force);
    if (!dur.ok) throw new Error(dur.error);
  }

  // 1. Render lock
  const unlock = acquireRenderLock();
  console.log(`🔒 Render lock acquired (PID ${process.pid})`);

  return unlock;
}


