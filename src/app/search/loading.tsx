export default function SearchLoading() {
  return (
    <div className="space-y-2">
      <div className="h-20 animate-pulse border border-line bg-white" />
      <div className="grid gap-2 lg:grid-cols-[200px_1fr]">
        <div className="h-[560px] animate-pulse border border-line bg-white" />
        <div className="h-[560px] animate-pulse border border-line bg-white" />
      </div>
    </div>
  );
}