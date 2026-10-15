import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

type Props = {
  title: string;
  theme: "light" | "dark";
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onToggleTheme: () => void;
  recents: string[];
  onOpenRecent: (path: string) => void;
  onClearRecents: () => void;
};

export function MenuBar({
  title,
  theme,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onToggleTheme,
  recents,
  onOpenRecent,
  onClearRecents,
}: Props) {
  return (
    <div className="flex h-10 items-center justify-between border-b px-2">
      <Menubar className="border-0 bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent className="min-w-[16rem]">
            <MenubarItem onClick={onNew}>
              New <MenubarShortcut>Ctrl+N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onOpen}>
              Open… <MenubarShortcut>Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger disabled={recents.length === 0}>
                Open Recent
              </MenubarSubTrigger>
              <MenubarSubContent className="min-w-[14rem] max-w-sm">
                {recents.map((p) => (
                  <MenubarItem
                    key={p}
                    title={p}
                    onClick={() => onOpenRecent(p)}
                  >
                    {p.split(/[\\/]/).pop()}
                  </MenubarItem>
                ))}
                <MenubarSeparator />
                <MenubarItem onClick={onClearRecents}>Clear Recent</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={onSave}>
              Save <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onSaveAs}>
              Save As… <MenubarShortcut>Ctrl+Shift+S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <span className="text-sm text-muted-foreground">{title}</span>

      <Button variant="ghost" size="icon" onClick={onToggleTheme}>
        {theme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </Button>
    </div>
  );
}
