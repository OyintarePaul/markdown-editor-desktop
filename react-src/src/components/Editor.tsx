import { Textarea } from "@/components/ui/textarea";

type Props = {
	value: string;
	onChange: (value: string) => void;
};

export function Editor({ value, onChange }: Props) {
	return (
		<Textarea
			value={value}
			onChange={(e) => onChange(e.target.value)}
			spellCheck={false}
			placeholder="Start writing markdown…"
			className="h-full w-full resize-none rounded-none border-0 p-4 font-mono text-sm shadow-none focus-visible:ring-0"
		/>
	);
}
