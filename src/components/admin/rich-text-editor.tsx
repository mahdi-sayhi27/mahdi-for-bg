"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link2 } from "lucide-react";

const TOOLBAR_ACTIONS = [
  { command: "bold", icon: Bold, label: "Gras" },
  { command: "italic", icon: Italic, label: "Italique" },
  { command: "underline", icon: Underline, label: "Souligné" },
  { command: "insertUnorderedList", icon: List, label: "Liste à puces" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Liste numérotée" },
] as const;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez le contenu de l'article...",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Only sync external value → DOM on mount / when switching which item is being edited,
  // never on every keystroke (that would fight the caret position).
  useEffect(() => {
    if (editorRef.current && isFirstRender.current) {
      editorRef.current.innerHTML = value;
      isFirstRender.current = false;
    }
  }, [value]);

  const exec = (command: string) => {
    document.execCommand(command);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const insertLink = () => {
    const url = window.prompt("URL du lien :");
    if (!url) return;
    document.execCommand("createLink", false, url);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden focus-within:border-sky-500 transition-all">
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.command}
            type="button"
            title={action.label}
            onClick={() => exec(action.command)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <action.icon size={15} />
          </button>
        ))}
        <button
          type="button"
          title="Insérer un lien"
          onClick={insertLink}
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Link2 size={15} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className="min-h-[160px] max-h-[360px] overflow-y-auto px-4 py-3 text-gray-100 outline-none leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-sky-400 [&_a]:underline [&_strong]:font-bold"
      />
    </div>
  );
}
