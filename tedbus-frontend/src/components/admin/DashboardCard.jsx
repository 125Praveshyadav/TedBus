const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color = "red",
  subtitle,
}) => {
  const colorClasses = {
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-xs font-semibold text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            colorClasses[color]
          }`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;