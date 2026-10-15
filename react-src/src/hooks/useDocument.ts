import { useCallback, useState } from "react";

const SAMPLE = "";

export function useDocument() {
	const [path, setPath] = useState<string | null>(null);
	const [content, setContent] = useState(SAMPLE);
	const [savedContent, setSavedContent] = useState(SAMPLE);

	const isDirty = content !== savedContent;
	const fileName = path ? path.split(/[\\/]/).pop()! : "Untitled.md";

	// Replace the whole document (used by Open and New)
	const load = useCallback((newPath: string | null, text: string) => {
		setPath(newPath);
		setContent(text);
		setSavedContent(text);
	}, []);

	// Call after a successful write to disk
	const markSaved = useCallback((text: string, newPath?: string) => {
		if (newPath) setPath(newPath);
		setSavedContent(text);
	}, []);

	return { path, fileName, content, setContent, isDirty, load, markSaved };
}
