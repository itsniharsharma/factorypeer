export default function CategoryLoading() {
  return (
    <div className="space-y-2">
      <div className="h-14 animate-pulse border border-line bg-white" />
      <div className="grid gap-2 lg:grid-cols-[220px_1fr]">
        <div className="h-[640px] animate-pulse border border-line bg-white" />
        <div className="h-[640px] animate-pulse border border-line bg-white" />
      </div>
    </div>
  );
}
