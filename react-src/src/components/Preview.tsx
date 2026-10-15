import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";
import "highlight.js/styles/github-dark.css";

export function Preview({ content }: { content: string }) {
	return (
		<ScrollArea className="h-full">
			<article className="prose prose-neutral dark:prose-invert max-w-none p-6 prose-pre:p-0">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight]}
				>
					{content}
				</ReactMarkdown>
			</article>
		</ScrollArea>
	);
}
