interface Props {
  input: string;

  setInput: (
    value: string
  ) => void;

  onSend: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
}: Props) {
  return (
    <div className="border-t border-zinc-800 p-5">

      <div className="flex gap-3">

        <input
          className="flex-1 rounded-lg bg-zinc-900 p-4 outline-none"

          value={input}

          placeholder="Ask MindWeave..."

          onChange={(e) =>
            setInput(e.target.value)
          }

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />

        <button
          onClick={onSend}
          className="rounded-lg bg-blue-600 px-6"
        >
          Send
        </button>

      </div>

    </div>
  );
}