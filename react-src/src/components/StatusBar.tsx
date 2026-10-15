export function StatusBar({
	content,
	isDirty,
}: {
	content: string;
	isDirty: boolean;
}) {
	const trimmed = content.trim();
	const words = trimmed ? trimmed.split(/\s+/).length : 0;
	const lines = content.split("\n").length;

	return (
		<footer className="flex h-7 items-center justify-between border-t px-3 text-xs text-muted-foreground">
			<span>
				{words} words · {lines} lines
			</span>
			<span>{isDirty ? "Unsaved changes" : "Saved"}</span>
		</footer>
	);
}
