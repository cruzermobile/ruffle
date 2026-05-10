#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const DECODER_GZ_B64 = "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";
const DICT_SIZE = 64 * 1024 * 1024;

function usage() {
  console.error("Usage: node tools/build-single-file-ruffle-loader.mjs <selfhosted-dist-dir> <output-html> [--full-output <path>] [--no-compress]");
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length < 2) usage();

const distDir = path.resolve(args[0]);
const outFile = path.resolve(args[1]);
let fullOutFile = "";
let noCompress = false;

for (let i = 2; i < args.length; i++) {
  if (args[i] === "--full-output") {
    fullOutFile = path.resolve(args[++i] || "");
    if (!fullOutFile) usage();
  } else if (args[i] === "--no-compress") {
    noCompress = true;
  } else {
    usage();
  }
}

if (!existsSync(distDir)) {
  throw new Error(`Selfhosted dist directory does not exist: ${distDir}`);
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function formatBytes(bytes) {
  return new Intl.NumberFormat("en-US").format(bytes);
}

function chunkString(value, size = 16_384) {
  const chunks = [];
  for (let i = 0; i < value.length; i += size) chunks.push(value.slice(i, i + size));
  return chunks;
}

function jsString(value) {
  return JSON.stringify(value);
}

function scriptSafe(value) {
  return value
    .replace(/<\/script/gi, "<\\/script")
    .replace(/<!--/g, "<\\!--");
}

function mimeFor(name) {
  if (name.endsWith(".wasm")) return "application/wasm";
  if (name.endsWith(".js")) return "text/javascript";
  return "application/octet-stream";
}

function isRuntimeAsset(name) {
  return name === "ruffle.js" || /^core\.ruffle\..*\.js$/.test(name) || /\.wasm$/i.test(name);
}

const runtimeNames = readdirSync(distDir).filter(isRuntimeAsset).sort((a, b) => {
  if (a === "ruffle.js") return -1;
  if (b === "ruffle.js") return 1;
  if (a.endsWith(".js") && b.endsWith(".wasm")) return -1;
  if (a.endsWith(".wasm") && b.endsWith(".js")) return 1;
  return a.localeCompare(b);
});

if (!runtimeNames.includes("ruffle.js")) {
  throw new Error(`Could not find ruffle.js in ${distDir}`);
}
if (!runtimeNames.some((name) => /^core\.ruffle\..*\.js$/.test(name))) {
  throw new Error(`Could not find core.ruffle.*.js chunk(s) in ${distDir}`);
}
if (!runtimeNames.some((name) => name.endsWith(".wasm"))) {
  throw new Error(`Could not find .wasm runtime file(s) in ${distDir}`);
}

const ruffleJs = readFileSync(path.join(distDir, "ruffle.js"), "utf8");
const embeddedAssets = {};
for (const name of runtimeNames) {
  if (name === "ruffle.js") continue;
  const filePath = path.join(distDir, name);
  const bytes = readFileSync(filePath);
  embeddedAssets[name] = {
    type: mimeFor(name),
    size: bytes.length,
    sha256: sha256Hex(bytes),
    b64: bytes.toString("base64"),
  };
}

function assetLoaderSource() {
  (() => {
    "use strict";
    const EMBED_PREFIX = "ruffle-embedded:///";
    const ASSETS = window.__RUFFLE_EMBEDDED_ASSETS__;
    const byteCache = new Map();
    const blobUrlCache = new Map();

    window.__RUFFLE_EMBEDDED_ASSET_MANIFEST__ = Object.fromEntries(
      Object.entries(ASSETS).map(([name, meta]) => [name, { type: meta.type, size: meta.size, sha256: meta.sha256 }])
    );

    function nameFromUrl(value) {
      if (!value) return null;
      let raw = "";
      try {
        raw = typeof value === "string" ? value : value.url || String(value);
      } catch {
        raw = String(value);
      }

      const clean = raw.split("#")[0].split("?")[0];
      let decoded = clean;
      try {
        decoded = decodeURIComponent(clean);
      } catch {}

      for (const name of Object.keys(ASSETS)) {
        if (decoded === name || decoded.endsWith("/" + name) || decoded.endsWith(name)) return name;
      }
      return null;
    }

    function base64ToBytes(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      const step = 0x8000;
      for (let offset = 0; offset < binary.length; offset += step) {
        const slice = binary.slice(offset, offset + step);
        for (let i = 0; i < slice.length; i++) bytes[offset + i] = slice.charCodeAt(i);
      }
      return bytes;
    }

    function getBytes(name) {
      if (!byteCache.has(name)) byteCache.set(name, base64ToBytes(ASSETS[name].b64));
      return byteCache.get(name);
    }

    function getBlobUrl(name) {
      if (!blobUrlCache.has(name)) {
        blobUrlCache.set(name, URL.createObjectURL(new Blob([getBytes(name)], { type: ASSETS[name].type || "application/octet-stream" })));
      }
      return blobUrlCache.get(name);
    }

    function mapScriptUrl(value) {
      const name = nameFromUrl(value);
      return name && name.endsWith(".js") ? getBlobUrl(name) : value;
    }

    window.__ruffleEmbeddedAssetUrl = getBlobUrl;
    window.__ruffleEmbeddedAssetBytes = getBytes;

    const originalFetch = window.fetch ? window.fetch.bind(window) : null;
    window.fetch = function(input, init) {
      const name = nameFromUrl(input);
      if (name && ASSETS[name]) {
        const meta = ASSETS[name];
        return Promise.resolve(new Response(getBytes(name).slice(), {
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": meta.type || "application/octet-stream",
            "Content-Length": String(meta.size),
          },
        }));
      }
      if (!originalFetch) return Promise.reject(new TypeError("fetch is unavailable in this browser"));
      return originalFetch(input, init);
    };

    try {
      const desc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
      if (desc && desc.set && desc.get) {
        Object.defineProperty(HTMLScriptElement.prototype, "src", {
          configurable: true,
          enumerable: desc.enumerable,
          get() {
            return desc.get.call(this);
          },
          set(value) {
            return desc.set.call(this, mapScriptUrl(value));
          },
        });
      }
    } catch (error) {
      console.warn("Could not patch script src setter; appendChild patch will still try to map Ruffle chunks.", error);
    }

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      if (this instanceof HTMLScriptElement && String(name).toLowerCase() === "src") {
        return originalSetAttribute.call(this, name, mapScriptUrl(value));
      }
      return originalSetAttribute.call(this, name, value);
    };

    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
      if (child instanceof HTMLScriptElement) {
        const mapped = mapScriptUrl(child.getAttribute("src") || child.src);
        if (mapped && mapped !== child.src) child.src = mapped;
      }
      return originalAppendChild.call(this, child);
    };

    window.RufflePlayer = window.RufflePlayer || {};
    window.RufflePlayer.config = {
      ...(window.RufflePlayer.config || {}),
      publicPath: EMBED_PREFIX,
      logLevel: "error",
      allowScriptAccess: false,
      warnOnUnsupportedContent: true,
      showSwfDownload: false,
      splashScreen: true,
      contextMenu: true,
      autoplay: "on",
    };
  })();
}

function appRuntimeSource() {
  (() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const state = { file: null, bytes: null, player: null, autoPaused: false };

    const els = {
      input: $("swfInput"),
      drop: $("dropzone"),
      mount: $("playerMount"),
      empty: $("emptyState"),
      status: $("status"),
      fileMeta: $("fileMeta"),
      reload: $("reloadButton"),
      clear: $("clearButton"),
      fullscreen: $("fullscreenButton"),
      exportSave: $("exportSaveButton"),
      importSave: $("saveImportInput"),
      clearSave: $("clearSaveButton"),
      importMode: $("importMode"),
      saveStatus: $("saveStatus"),
      saveStats: $("saveStats"),
      renderer: $("rendererSelect"),
      quality: $("qualitySelect"),
      frameRate: $("frameRateSelect"),
      stagePixels: $("stagePixelsSelect"),
      autoPauseHidden: $("autoPauseHidden"),
      apply: $("applyPerfButton"),
    };

    function setStatus(message, tone = "") {
      els.status.className = "status " + tone;
      els.status.textContent = message;
    }

    function setSaveStatus(message, tone = "") {
      els.saveStatus.className = "status mini " + tone;
      els.saveStatus.textContent = message;
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes)) return "unknown size";
      const units = ["B", "KB", "MB", "GB"];
      let size = bytes;
      let unit = 0;
      while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit++;
      }
      return `${size.toFixed(unit ? 2 : 0)} ${units[unit]}`;
    }

    function downloadBlob(blob, name) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }

    function getPerformanceLoadOptions() {
      const out = {
        wmode: "opaque",
        splashScreen: false,
        warnOnUnsupportedContent: false,
        contextMenu: "rightClickOnly",
        allowFullscreen: true,
        allowScriptAccess: false,
        showSwfDownload: false,
      };

      if (els.renderer.value) out.preferredRenderer = els.renderer.value;
      if (els.quality.value) out.quality = els.quality.value;
      if (els.frameRate.value) out.frameRate = Number(els.frameRate.value);
      return out;
    }

    function applyStageSize() {
      const max = els.stagePixels.value;
      if (max) {
        els.mount.style.maxWidth = max + "px";
        els.mount.style.maxHeight = max + "px";
      } else {
        els.mount.style.maxWidth = "";
        els.mount.style.maxHeight = "";
      }
    }

    function resetPlayer() {
      els.mount.textContent = "";
      state.player = null;
      els.empty.hidden = false;
      els.reload.disabled = true;
      els.clear.disabled = true;
      els.fullscreen.disabled = true;
    }

    function createPlayer() {
      if (!window.RufflePlayer || typeof window.RufflePlayer.newest !== "function") {
        throw new Error("Ruffle did not initialize. Check browser console output.");
      }
      resetPlayer();
      const player = window.RufflePlayer.newest().createPlayer();
      player.style.width = "100%";
      player.style.height = "100%";
      player.style.display = "block";
      els.mount.appendChild(player);
      state.player = player;
      els.empty.hidden = true;
      els.reload.disabled = false;
      els.clear.disabled = false;
      els.fullscreen.disabled = false;
      return player;
    }

    async function loadSwfFile(file) {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".swf")) {
        setStatus("That does not look like a .swf file.", "bad");
        return;
      }

      try {
        setStatus("Reading " + file.name + " locally...", "warn");
        state.file = file;
        state.bytes = await file.arrayBuffer();
        els.fileMeta.textContent = file.name + " - " + formatBytes(file.size);
        applyStageSize();

        const player = createPlayer();
        await player.ruffle().load({
          data: state.bytes,
          swfFileName: file.name,
          ...getPerformanceLoadOptions(),
        });

        setStatus("Loaded " + file.name + ".", "good");
        refreshSaveStats();
      } catch (error) {
        console.error(error);
        setStatus(error && error.message ? error.message : "Could not load that SWF.", "bad");
      }
    }

    async function reloadCurrent() {
      if (state.file) await loadSwfFile(state.file);
    }

    function readableCookies() {
      const out = {};
      if (!document.cookie) return out;
      for (const part of document.cookie.split(";")) {
        const index = part.indexOf("=");
        if (index === -1) continue;
        out[decodeURIComponent(part.slice(0, index).trim())] = decodeURIComponent(part.slice(index + 1));
      }
      return out;
    }

    async function exportIndexedDb() {
      if (!indexedDB || typeof indexedDB.databases !== "function") return [];
      const databases = await indexedDB.databases();
      const output = [];
      for (const dbInfo of databases) {
        if (!dbInfo.name) continue;
        try {
          const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(dbInfo.name);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
          });

          const stores = {};
          for (const storeName of Array.from(db.objectStoreNames)) {
            stores[storeName] = await new Promise((resolve, reject) => {
              const tx = db.transaction(storeName, "readonly");
              const store = tx.objectStore(storeName);
              const req = store.getAll();
              req.onerror = () => reject(req.error);
              req.onsuccess = () => resolve(req.result);
            });
          }

          output.push({ name: dbInfo.name, version: db.version, stores });
          db.close();
        } catch (error) {
          output.push({ name: dbInfo.name, error: error && error.message ? error.message : String(error) });
        }
      }
      return output;
    }

    function storageObject(storage) {
      const out = {};
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        out[key] = storage.getItem(key);
      }
      return out;
    }

    function currentSwfBaseCandidates() {
      if (!state.file) return [];
      const name = state.file.name;
      const candidates = new Set();
      candidates.add("localhost/" + name);

      try {
        const decodedPath = decodeURIComponent(location.pathname || "");
        const dir = decodedPath.replace(/\/[^/]*$/, "");
        if (dir) candidates.add("localhost" + dir + "/" + name);
      } catch {}

      return Array.from(candidates).filter(Boolean);
    }

    function remapSharedObjectKeys(importedLocalStorage) {
      if (!state.file || !importedLocalStorage) return 0;
      const bases = currentSwfBaseCandidates();
      let copies = 0;

      for (const [key, value] of Object.entries(importedLocalStorage)) {
        let suffix = "";
        const swfIndex = key.toLowerCase().lastIndexOf(".swf/");
        if (swfIndex !== -1) suffix = key.slice(swfIndex + 5);
        else if (/\/(mainprofile|save|savegame|savedata|slot\d*)$/i.test(key)) suffix = key.split("/").pop();

        if (!suffix) continue;

        for (const base of bases) {
          const nextKey = base + "/" + suffix;
          if (nextKey !== key) {
            localStorage.setItem(nextKey, value);
            copies++;
          }
        }
      }

      return copies;
    }

    function restorePlainStorage(storage, values, replace) {
      if (!values) return 0;
      if (replace) storage.clear();
      let count = 0;
      for (const [key, value] of Object.entries(values)) {
        storage.setItem(key, value);
        count++;
      }
      return count;
    }

    async function exportSaves() {
      try {
        const snapshot = {
          format: "ruffle-single-file-save-snapshot-v2",
          exportedAt: new Date().toISOString(),
          page: location.href,
          swfName: state.file ? state.file.name : null,
          localStorage: storageObject(localStorage),
          sessionStorage: storageObject(sessionStorage),
          cookies: readableCookies(),
          indexedDB: await exportIndexedDb(),
        };

        const safeName = (state.file ? state.file.name.replace(/\.swf$/i, "") : "ruffle").replace(/[^a-z0-9._-]+/gi, "_");
        downloadBlob(new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" }), safeName + "_save_snapshot.json");
        setSaveStatus("Save snapshot exported.", "good");
      } catch (error) {
        console.error(error);
        setSaveStatus(error && error.message ? error.message : "Could not export saves.", "bad");
      }
    }

    async function importSaves(file) {
      if (!file) return;
      try {
        const snapshot = JSON.parse(await file.text());
        const replace = els.importMode.value === "replace";
        const localCount = restorePlainStorage(localStorage, snapshot.localStorage, replace);
        const sessionCount = restorePlainStorage(sessionStorage, snapshot.sessionStorage, replace);
        const remapCount = remapSharedObjectKeys(snapshot.localStorage);

        setSaveStatus(`Imported ${localCount} local keys, ${sessionCount} session keys, ${remapCount} remapped key copies.`, "good");
        refreshSaveStats();
        if (state.file) await reloadCurrent();
      } catch (error) {
        console.error(error);
        setSaveStatus(error && error.message ? error.message : "Could not import save snapshot.", "bad");
      } finally {
        els.importSave.value = "";
      }
    }

    function clearSaves() {
      localStorage.clear();
      sessionStorage.clear();
      setSaveStatus("localStorage and sessionStorage cleared.", "warn");
      refreshSaveStats();
    }

    function refreshSaveStats() {
      const local = localStorage.length;
      const session = sessionStorage.length;
      const cookies = document.cookie ? document.cookie.split(";").filter(Boolean).length : 0;
      els.saveStats.textContent = `${local} localStorage - ${session} sessionStorage - ${cookies} cookies`;
    }

    els.input.addEventListener("change", () => loadSwfFile(els.input.files && els.input.files[0]));
    els.drop.addEventListener("dragover", (event) => {
      event.preventDefault();
      els.drop.classList.add("drag");
    });
    els.drop.addEventListener("dragleave", () => els.drop.classList.remove("drag"));
    els.drop.addEventListener("drop", (event) => {
      event.preventDefault();
      els.drop.classList.remove("drag");
      const file = event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) loadSwfFile(file);
    });

    els.reload.addEventListener("click", reloadCurrent);
    els.clear.addEventListener("click", () => {
      resetPlayer();
      state.file = null;
      state.bytes = null;
      els.input.value = "";
      els.fileMeta.textContent = "No SWF loaded";
      setStatus("Player cleared.", "warn");
    });
    els.fullscreen.addEventListener("click", () => {
      if (state.player && state.player.requestFullscreen) state.player.requestFullscreen();
    });

    els.apply.addEventListener("click", reloadCurrent);
    els.stagePixels.addEventListener("change", applyStageSize);
    els.exportSave.addEventListener("click", exportSaves);
    els.importSave.addEventListener("change", () => importSaves(els.importSave.files && els.importSave.files[0]));
    els.clearSave.addEventListener("click", clearSaves);

    document.addEventListener("visibilitychange", () => {
      if (!state.player || !els.autoPauseHidden.checked) return;
      try {
        if (document.hidden && typeof state.player.pause === "function") {
          state.player.pause();
          state.autoPaused = true;
        } else if (!document.hidden && state.autoPaused && typeof state.player.play === "function") {
          state.player.play();
          state.autoPaused = false;
        }
      } catch {}
    });

    applyStageSize();
    refreshSaveStats();
    setStatus("Ready. Choose a SWF file.");
  })();
}

function buildAppHtml() {
  const assetRows = Object.entries(embeddedAssets)
    .map(([name, meta]) => `<li><code>${name}</code> ${formatBytes(meta.size)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Single-file Ruffle SWF Loader</title>
<style>
:root{color-scheme:dark;--bg:#060816;--card:#10162a;--card2:#151d38;--line:rgba(255,255,255,.14);--text:rgba(255,255,255,.92);--muted:rgba(255,255,255,.62);--good:#22c55e;--warn:#f59e0b;--bad:#ef4444;--accent:#8b5cf6;--accent2:#06b6d4}
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 15% 0,rgba(139,92,246,.38),transparent 30rem),radial-gradient(circle at 90% 15%,rgba(6,182,212,.26),transparent 28rem),linear-gradient(135deg,#05060f,#10162c);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--text)}
main{width:min(1180px,100%);margin:0 auto;padding:24px}.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-bottom:18px}.card{border:1px solid var(--line);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.045));box-shadow:0 24px 90px rgba(0,0,0,.38);padding:20px}.title{font-size:clamp(30px,5vw,58px);line-height:.94;letter-spacing:-.055em;margin:0 0 12px}.muted{color:var(--muted);line-height:1.55}.grid{display:grid;grid-template-columns:330px 1fr;gap:18px}.controls{display:grid;gap:12px}.drop{border:1px dashed rgba(255,255,255,.3);border-radius:22px;background:rgba(255,255,255,.05);padding:18px;cursor:pointer}.drop.drag{border-color:var(--accent2);background:rgba(6,182,212,.1)}.drop input{width:100%;margin-top:12px}.row{display:flex;flex-wrap:wrap;gap:8px}.field{display:grid;gap:6px}.field label{font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.05em}button,select,.file-button{appearance:none;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.08);color:var(--text);padding:10px 12px;font:inherit;font-weight:750}button:hover,.file-button:hover{background:rgba(255,255,255,.13)}button:disabled{opacity:.45;cursor:not-allowed}select{width:100%}.status{border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.06);padding:11px 12px;color:var(--muted)}.status.good{border-color:rgba(34,197,94,.45);color:#bbf7d0}.status.warn{border-color:rgba(245,158,11,.45);color:#fde68a}.status.bad{border-color:rgba(239,68,68,.45);color:#fecaca}.mini{font-size:13px}.stage{min-height:540px;display:grid;grid-template-rows:1fr;border-radius:28px;overflow:hidden;border:1px solid var(--line);background:#05060f}.empty{display:grid;place-items:center;padding:32px;text-align:center;color:var(--muted)}.empty[hidden]{display:none}.mount{width:100%;height:100%;min-height:540px;margin:auto;background:#000}.mount ruffle-player{width:100%;height:100%}.assets summary{cursor:pointer;color:var(--muted)}.assets ul{margin:10px 0 0;padding-left:18px;color:var(--muted);font-size:13px;line-height:1.6}code{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:1px 5px}@media(max-width:860px){.hero,.grid{grid-template-columns:1fr}.stage,.mount{min-height:360px}}
</style>
</head>
<body>
<main>
<section class="hero">
  <div class="card">
    <h1 class="title">Single-file Ruffle loader</h1>
    <p class="muted">Loads a SWF from your device using Ruffle embedded inside this HTML. No CDN, no sidecar WASM, no dignified architecture. Useful things are rarely tidy.</p>
  </div>
  <div class="card assets">
    <div class="status" id="status">Starting...</div>
    <p id="fileMeta" class="muted">No SWF loaded</p>
    <details><summary>Embedded runtime assets</summary><ul>${assetRows}</ul></details>
  </div>
</section>
<section class="grid">
  <aside class="controls">
    <label class="drop" id="dropzone">
      <strong>Select or drop a SWF</strong>
      <p class="muted">The file is read locally by your browser.</p>
      <input id="swfInput" type="file" accept=".swf,application/x-shockwave-flash">
    </label>
    <div class="card">
      <div class="row">
        <button id="reloadButton" disabled>Reload</button>
        <button id="fullscreenButton" disabled>Fullscreen</button>
        <button id="clearButton" disabled>Clear</button>
      </div>
    </div>
    <div class="card">
      <h3>Performance</h3>
      <div class="field"><label>Renderer</label><select id="rendererSelect"><option value="webgl" selected>WebGL</option><option value="">Auto</option><option value="wgpu-webgl">wgpu-webgl</option><option value="canvas">Canvas fallback</option></select></div>
      <div class="field"><label>Quality</label><select id="qualitySelect"><option value="low" selected>Low</option><option value="">Movie default</option><option value="medium">Medium</option><option value="high">High</option></select></div>
      <div class="field"><label>Frame rate cap</label><select id="frameRateSelect"><option value="30" selected>30 FPS</option><option value="">Movie default</option><option value="24">24 FPS</option><option value="20">20 FPS</option><option value="15">15 FPS</option></select></div>
      <div class="field"><label>Stage size</label><select id="stagePixelsSelect"><option value="720" selected>720px</option><option value="">Container</option><option value="900">900px</option><option value="540">540px</option><option value="420">420px</option></select></div>
      <p><label><input id="autoPauseHidden" type="checkbox" checked> Pause when tab is hidden</label></p>
      <button id="applyPerfButton">Apply / reload</button>
    </div>
    <div class="card">
      <h3>Saves</h3>
      <div class="field"><label>Import behavior</label><select id="importMode"><option value="merge" selected>Merge imported keys</option><option value="replace">Replace storage first</option></select></div>
      <div class="row">
        <button id="exportSaveButton">Export save</button>
        <label class="file-button">Import save<input id="saveImportInput" type="file" accept="application/json,.json" hidden></label>
        <button id="clearSaveButton">Clear saves</button>
      </div>
      <p id="saveStats" class="muted">Storage scan pending</p>
      <div id="saveStatus" class="status mini">Save manager ready.</div>
    </div>
  </aside>
  <section class="stage">
    <div id="emptyState" class="empty"><div><h2>No SWF loaded yet</h2><p>Select a SWF file to start Ruffle.</p></div></div>
    <div id="playerMount" class="mount"></div>
  </section>
</section>
</main>
<script>window.__RUFFLE_EMBEDDED_ASSETS__=${JSON.stringify(embeddedAssets)};</script>
<script>${scriptSafe(`(${assetLoaderSource.toString()})();`)}</script>
<script data-ruffle-inline>${scriptSafe(ruffleJs)}</script>
<script>${scriptSafe(`(${appRuntimeSource.toString()})();`)}</script>
</body>
</html>`;
}

function buildBootstrap(compressedPayload, outSize, expectedSha) {
  const payloadChunks = chunkString(compressedPayload.toString("base64"));
  const decoderChunks = chunkString(DECODER_GZ_B64);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compressed Single-file Ruffle Loader</title>
<style>
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--bg0:#05060f;--bg1:#10162c;--line:rgba(255,255,255,.15);--text:rgba(255,255,255,.92);--muted:rgba(255,255,255,.64);--accent:#8b5cf6;--accent2:#06b6d4;--bad:#ef4444}
*{box-sizing:border-box}html,body{min-height:100%}body{margin:0;display:grid;place-items:center;padding:24px;color:var(--text);background:radial-gradient(circle at 18% 0%,rgba(139,92,246,.45),transparent 34rem),radial-gradient(circle at 84% 18%,rgba(6,182,212,.34),transparent 32rem),linear-gradient(135deg,var(--bg0),var(--bg1))}
.card{width:min(760px,100%);border:1px solid var(--line);border-radius:30px;padding:30px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.05)),rgba(8,12,26,.78);box-shadow:0 30px 120px rgba(0,0,0,.46);backdrop-filter:blur(22px)}.badge{display:inline-flex;gap:8px;align-items:center;padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.78);font-size:13px;font-weight:760}.pulse{width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 0 0 7px rgba(6,182,212,.13)}
h1{margin:22px 0 10px;font-size:clamp(30px,6vw,56px);line-height:.94;letter-spacing:-.055em}p{margin:0;color:var(--muted);line-height:1.6}.bar{overflow:hidden;height:12px;margin:24px 0 12px;border-radius:999px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.1)}.bar span{display:block;height:100%;width:38%;border-radius:inherit;background:linear-gradient(90deg,var(--accent),var(--accent2));animation:drift 1.25s ease-in-out infinite alternate}@keyframes drift{from{transform:translateX(-55%)}to{transform:translateX(220%)}}code{color:rgba(255,255,255,.78);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:2px 6px}.error{margin-top:16px;padding:14px;border-radius:16px;border:1px solid rgba(239,68,68,.4);background:rgba(239,68,68,.11);color:rgba(255,255,255,.84);white-space:pre-wrap}.meta{margin-top:12px;font-size:12px;color:rgba(255,255,255,.44);word-break:break-all}
</style>
</head>
<body>
<main class="card">
<span class="badge"><span class="pulse"></span> gzip-decoder + LZMA2 payload</span>
<h1>Unpacking the player...</h1>
<p id="status">Bootstrapping compressed decoder. No network, no sidecar files.</p>
<div class="bar" aria-hidden="true"><span></span></div>
<p class="meta">Original HTML: <code>${formatBytes(outSize)} bytes</code><br>Raw LZMA2 payload: <code>${formatBytes(compressedPayload.length)} bytes</code><br>Original SHA-256: <code>${expectedSha}</code></p>
<div id="error" class="error" hidden></div>
</main>
<script>
const DECODER_GZ_B64_CHUNKS=${JSON.stringify(decoderChunks)};
const PAYLOAD_LZMA2_B64_CHUNKS=${JSON.stringify(payloadChunks)};
const OUT_SIZE=${outSize};
const DICT_SIZE=${DICT_SIZE};
const EXPECTED_HTML_SHA256=${jsString(expectedSha)};
const statusEl=document.getElementById("status");
const errorEl=document.getElementById("error");
function setStatus(text){statusEl.textContent=text}
function fail(error){console.error(error);errorEl.hidden=false;errorEl.textContent="Could not unpack this LZMA2-compressed HTML.\\n\\n"+(error&&error.stack?error.stack:error&&error.message?error.message:String(error))}
function base64ToUint8Array(base64){const binary=atob(base64);const bytes=new Uint8Array(binary.length);const step=0x8000;for(let offset=0;offset<binary.length;offset+=step){const slice=binary.slice(offset,offset+step);for(let i=0;i<slice.length;i++)bytes[offset+i]=slice.charCodeAt(i)}return bytes}
async function gunzipToText(bytes){if(!("DecompressionStream"in globalThis))throw new Error("This browser does not support DecompressionStream('gzip'). Use a current Chromium/Firefox build.");const stream=new Blob([bytes],{type:"application/gzip"}).stream().pipeThrough(new DecompressionStream("gzip"));return await new Response(stream).text()}
async function sha256Hex(bytes){const digest=await crypto.subtle.digest("SHA-256",bytes);return[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("")}
async function decodeInWorker(decoderCode,payloadBytes){const workerAppend="\\nself.onmessage=function(event){try{const input=new Uint8Array(event.data.payload);const output=lzma2RawDecompress(input,event.data.outSize,{dictSize:event.data.dictSize});self.postMessage({ok:true,output:output.buffer},[output.buffer])}catch(error){self.postMessage({ok:false,error:error&&error.stack?error.stack:String(error)})}};";const workerCode=decoderCode+workerAppend;const url=URL.createObjectURL(new Blob([workerCode],{type:"text/javascript"}));try{const worker=new Worker(url);return await new Promise((resolve,reject)=>{worker.onmessage=event=>{worker.terminate();if(event.data&&event.data.ok)resolve(new Uint8Array(event.data.output));else reject(new Error(event.data&&event.data.error?event.data.error:"Worker decode failed"))};worker.onerror=event=>{worker.terminate();reject(new Error(event.message||"Worker failed"))};worker.postMessage({payload:payloadBytes.buffer,outSize:OUT_SIZE,dictSize:DICT_SIZE},[payloadBytes.buffer])})}finally{URL.revokeObjectURL(url)}}
async function boot(){try{setStatus("Decoding gzipped decoder...");const decoderGzBytes=base64ToUint8Array(DECODER_GZ_B64_CHUNKS.join(""));setStatus("Inflating decoder with native gzip...");const decoderCode=await gunzipToText(decoderGzBytes);setStatus("Decoding LZMA2 payload...");const payloadBytes=base64ToUint8Array(PAYLOAD_LZMA2_B64_CHUNKS.join(""));let decompressedBytes;try{setStatus("Decompressing app in a worker...");decompressedBytes=await decodeInWorker(decoderCode,payloadBytes)}catch(workerError){console.warn("Worker decode failed; falling back to main thread",workerError);setStatus("Worker unavailable; decompressing on main thread...");(0,eval)(decoderCode);decompressedBytes=lzma2RawDecompress(payloadBytes,OUT_SIZE,{dictSize:DICT_SIZE})}setStatus("Verifying decompressed app...");if(crypto&&crypto.subtle){const actualHash=await sha256Hex(decompressedBytes);if(actualHash!==EXPECTED_HTML_SHA256)throw new Error("SHA-256 mismatch after decompression.")}setStatus("Launching Ruffle loader...");await Promise.resolve();document.body.style.opacity="0";document.body.style.transition="opacity 80ms ease";await new Promise(resolve=>requestAnimationFrame(resolve));const html=new TextDecoder("utf-8").decode(decompressedBytes);document.open();document.write(html);document.close()}catch(error){fail(error)}}
boot();
</script>
</body>
</html>
`;
}

function compressLzma2Raw(input) {
  const result = spawnSync("xz", ["--format=raw", "--lzma2=dict=64MiB,preset=9e", "-c"], {
    input,
    maxBuffer: 1024 * 1024 * 1024,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`xz failed with status ${result.status}: ${result.stderr.toString("utf8")}`);
  }
  return result.stdout;
}

const appHtml = buildAppHtml();
const appBytes = Buffer.from(appHtml, "utf8");
const appSha = sha256Hex(appBytes);

if (fullOutFile) {
  mkdirSync(path.dirname(fullOutFile), { recursive: true });
  writeFileSync(fullOutFile, appBytes);
}

let finalHtml;
if (noCompress) {
  finalHtml = appHtml;
} else {
  const compressed = compressLzma2Raw(appBytes);
  finalHtml = buildBootstrap(compressed, appBytes.length, appSha);
}

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, finalHtml);

const outputBytes = statSync(outFile).size;
console.log(`Runtime assets: ${runtimeNames.join(", ")}`);
console.log(`Full app HTML: ${formatBytes(appBytes.length)} bytes`);
if (!noCompress) console.log(`Compressed wrapper: ${formatBytes(outputBytes)} bytes`);
console.log(`Wrote ${outFile}`);
