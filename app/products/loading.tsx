export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-muted">
          <div className="aspect-square w-full rounded-t-lg bg-muted-foreground/10" />
          <div className="p-4">
            <div className="mb-2 h-4 w-2/3 rounded bg-muted-foreground/10" />
            <div className="mb-4 h-3 w-1/2 rounded bg-muted-foreground/10" />
            <div className="h-5 w-1/3 rounded bg-muted-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
