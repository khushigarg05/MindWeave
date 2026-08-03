interface Props {
  message: any;
}

export default function Message({
  message,
}: Props) {
  const user =
    message.role === "user";

  return (
    <div
      className={`flex ${
        user
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`rounded-xl p-4 max-w-3xl whitespace-pre-wrap ${
          user
            ? "bg-blue-600"
            : "bg-zinc-800"
        }`}
      >
        {message.content}

        {!user &&
          message.sources?.length > 0 && (
            <div className="mt-4 border-t border-zinc-700 pt-3">

              <div className="text-xs text-gray-400 mb-2">
                Sources
              </div>

              {message.sources.map(
                (
                  source: any,
                  index: number
                ) => (
                  <div
                    key={index}
                    className="text-xs text-green-400"
                  >
                    📄 {source.filename}
                    {" "}
                    ({source.score})
                  </div>
                )
              )}

            </div>
          )}
      </div>
    </div>
  );
}