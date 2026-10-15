import {
	app,
	events,
	filesystem,
	init,
	window as nlWindow,
	os,
	storage,
} from "@neutralinojs/lib";

type MsgArgs = Parameters<typeof os.showMessageBox>;
const YES_NO_CANCEL = "YES_NO_CANCEL" as MsgArgs[2];
const OK = "OK" as MsgArgs[2];
const QUESTION = "QUESTION" as MsgArgs[3];
const ERROR_ICON = "ERROR" as MsgArgs[3];

const MD_FILTERS = [
	{ name: "Markdown", extensions: ["md", "markdown", "txt"] },
	{ name: "All files", extensions: ["*"] },
];

// Evaluated lazily so it works regardless of when injectGlobals runs
export const isNative = () => "NL_TOKEN" in window;

// Delete this if you already call init() in main.tsx
let ready = false;
function ensureInit() {
	if (!ready && isNative()) {
		init();
		ready = true;
	}
}

const basename = (p: string) => p.split(/[\\/]/).pop() ?? p;

// ---------- browser fallbacks ----------

function pickFileInBrowser(): Promise<{
	path: string;
	content: string;
} | null> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".md,.markdown,.txt,text/markdown,text/plain";
		input.onchange = async () => {
			const file = input.files?.[0];
			resolve(file ? { path: file.name, content: await file.text() } : null);
		};
		input.oncancel = () => resolve(null);
		input.click();
	});
}

function downloadText(name: string, text: string) {
	const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}

// ---------- files ----------

export async function openFile() {
	if (!isNative()) return pickFileInBrowser();
	ensureInit();
	const picked = await os.showOpenDialog("Open Markdown file", {
		filters: MD_FILTERS,
	});
	if (!picked.length) return null;
	const path = picked[0];
	const content = await filesystem.readFile(path);
	return { path, content };
}

export async function saveFile(path: string, content: string) {
	if (!isNative()) return downloadText(basename(path), content);
	ensureInit();
	await filesystem.writeFile(path, content);
}

/** Returns the chosen path, or null if the user cancelled. */
export async function saveFileAs(content: string, suggestedName: string) {
	if (!isNative()) {
		downloadText(suggestedName, content);
		return suggestedName;
	}
	ensureInit();
	const chosen = await os.showSaveDialog("Save as", {
		defaultPath: suggestedName,
		filters: MD_FILTERS,
	});
	if (!chosen) return null;
	const path = /\.[^\\/]+$/.test(chosen) ? chosen : `${chosen}.md`;
	await filesystem.writeFile(path, content);
	return path;
}

// ---------- dialogs ----------

export async function askUnsaved(
	fileName: string,
): Promise<"save" | "discard" | "cancel"> {
	if (!isNative()) {
		return window.confirm(`Discard unsaved changes to ${fileName}?`)
			? "discard"
			: "cancel";
	}
	ensureInit();
	const answer = await os.showMessageBox(
		"Unsaved changes",
		`Save changes to ${fileName}?`,
		YES_NO_CANCEL,
		QUESTION,
	);
	return answer === "YES" ? "save" : answer === "NO" ? "discard" : "cancel";
}

export async function showError(prefix: string, err: unknown) {
	const detail = (err as { message?: string })?.message ?? String(err);
	console.error(prefix, err);
	if (!isNative()) return window.alert(`${prefix}: ${detail}`);
	ensureInit();
	await os.showMessageBox("Error", `${prefix}\n\n${detail}`, OK, ERROR_ICON);
}

// ---------- window ----------

export function setWindowTitle(title: string) {
	document.title = title;
	if (isNative()) {
		ensureInit();
		nlWindow.setTitle(title).catch(() => {});
	}
}

// ---------- settings ----------

export async function getSetting(key: string): Promise<string | null> {
	if (!isNative()) return localStorage.getItem(key);
	ensureInit();
	try {
		return await storage.getData(key);
	} catch {
		return null; // Neutralino throws when the key doesn't exist yet
	}
}

export async function setSetting(key: string, value: string) {
	if (!isNative()) return localStorage.setItem(key, value);
	ensureInit();
	await storage.setData(key, value);
}

// ---------- recents ----------

const RECENTS_KEY = "recents";

/** Open a known path directly, with no dialog (used by Open Recent). */
export async function openPath(path: string) {
	ensureInit();
	const content = await filesystem.readFile(path);
	return { path, content };
}

export async function getRecents(): Promise<string[]> {
	const raw = await getSetting(RECENTS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((p): p is string => typeof p === "string")
			: [];
	} catch {
		return [];
	}
}

export async function saveRecents(list: string[]) {
	await setSetting(RECENTS_KEY, JSON.stringify(list));
}

// ---------- app lifecycle ----------

export async function exitApp() {
	if (!isNative()) return window.close();
	ensureInit();
	await app.exit();
}

/** Calls handler when the user tries to close the window. Returns an unsubscribe function. */
export function onWindowClose(handler: () => void): () => void {
	if (!isNative()) return () => {};
	ensureInit();
	events.on("windowClose", handler);
	return () => {
		events.off("windowClose", handler);
	};
}
