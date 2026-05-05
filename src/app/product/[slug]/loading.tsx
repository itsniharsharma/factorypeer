export default function ProductLoading() {
  return (
    <div className="space-y-2">
      <div className="h-16 animate-pulse border border-line bg-white px-2 py-2" />
      <div className="grid gap-2 xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)_268px]">
        <div className="h-[420px] animate-pulse border border-line bg-white" />
        <div className="h-[420px] animate-pulse border border-line bg-white" />
        <div className="h-[420px] animate-pulse border border-line bg-white" />
      </div>
      <div className="h-40 animate-pulse border border-line bg-white" />
    </div>
  );
}
