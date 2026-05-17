export default function TaskCardSkeleton() {
  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-4 py-2 bg-white/5 flex items-center justify-between">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="flex gap-1">
          <div className="skeleton h-5 w-5 rounded" />
          <div className="skeleton h-5 w-5 rounded" />
        </div>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded-full" />
          <div className="skeleton h-4 w-3/4 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-3 w-14 rounded-full" />
        </div>
        <div className="skeleton h-8 w-full rounded-xl" />
      </div>
    </div>
  )
}
