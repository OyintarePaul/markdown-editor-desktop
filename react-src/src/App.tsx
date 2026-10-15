import { useEffect } from "react";

import { Editor } from "@/components/Editor";
import { MenuBar } from "@/components/MenuBar";
import { Preview } from "@/components/Preview";
import { StatusBar } from "@/components/StatusBar";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useCloseGuard } from "@/hooks/useCloseGuard";
import { useDocument } from "@/hooks/useDocument";
import { useRecents } from "@/hooks/useRecents";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useTheme } from "@/hooks/useTheme";

import {
	askUnsaved,
	openFile,
	openPath,
	saveFile,
	saveFileAs,
	setWindowTitle,
	showError,
} from "@/native/fileService";

export default function App() {
	const doc = useDocument();
	const {
		recents,
		add: addRecent,
		remove: removeRecent,
		clear: clearRecents,
	} = useRecents();
	const { theme, toggle } = useTheme();

	async function saveAs(): Promise<boolean> {
		const text = doc.content;
		try {
			const newPath = await saveFileAs(text, doc.fileName);
			if (!newPath) return false;
			doc.markSaved(text, newPath);
			addRecent(newPath);
			return true;
		} catch (e) {
			await showError("Could not save file.", e);
			return false;
		}
	}

	async function save(): Promise<boolean> {
		if (!doc.path) return saveAs();
		const text = doc.content;
		try {
			await saveFile(doc.path, text);
			doc.markSaved(text);
			return true;
		} catch (e) {
			await showError("Could not save file.", e);
			return false;
		}
	}

	// Resolves true if it's safe to replace the current document
	async function canDiscard(): Promise<boolean> {
		if (!doc.isDirty) return true;
		const choice = await askUnsaved(doc.fileName);
		if (choice === "cancel") return false;
		if (choice === "save") return save();
		return true;
	}

	const onNew = async () => {
		if (await canDiscard()) doc.load(null, "");
	};

	const onOpen = async () => {
		if (!(await canDiscard())) return;
		try {
			const file = await openFile();
			if (file) {
				doc.load(file.path, file.content);
				addRecent(file.path);
			}
		} catch (e) {
			await showError("Could not open file.", e);
		}
	};

	const onOpenRecent = async (path: string) => {
		if (!(await canDiscard())) return;
		try {
			const file = await openPath(path);
			doc.load(file.path, file.content);
			addRecent(file.path); // moves it to the top
		} catch (e) {
			removeRecent(path);
			await showError(
				"Could not open that file. It may have been moved or deleted.",
				e,
			);
		}
	};

	useShortcuts({ onNew, onOpen, onSave: save, onSaveAs: saveAs });
	useCloseGuard(doc.isDirty, canDiscard);

	useEffect(() => {
		setWindowTitle(
			`${doc.fileName}${doc.isDirty ? " •" : ""} – Markdown Editor`,
		);
	}, [doc.fileName, doc.isDirty]);

	return (
		<div className="flex h-screen flex-col bg-background text-foreground">
			<MenuBar
				title={`${doc.fileName}${doc.isDirty ? " •" : ""}`}
				theme={theme}
				onNew={onNew}
				onOpen={onOpen}
				onSave={save}
				onSaveAs={saveAs}
				onToggleTheme={toggle}
				recents={recents}
				onOpenRecent={onOpenRecent}
				onClearRecents={clearRecents}
			/>

			<ResizablePanelGroup orientation="horizontal" className="flex-1">
				<ResizablePanel>
					<Editor value={doc.content} onChange={doc.setContent} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>
					<Preview content={doc.content} />
				</ResizablePanel>
			</ResizablePanelGroup>

			<StatusBar content={doc.content} isDirty={doc.isDirty} />
		</div>
	);
}
