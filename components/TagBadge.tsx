export default function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="bg-dark-bg text-white font-mono text-[10px] px-2 py-0.5 uppercase tracking-[0.08em]">
      {tag}
    </span>
  );
}
