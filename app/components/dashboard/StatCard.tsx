interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
          {icon}
        </div>
      </div>
    </div>
  );
}