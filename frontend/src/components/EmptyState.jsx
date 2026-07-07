const EmptyState = ({ actionLabel, description, onAction, title }) => (
  <div className="pm-card flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
      ✦
    </div>

    <h3 className="text-xl font-semibold text-slate-950">{title}</h3>

    <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>

    {onAction && actionLabel ? (
      <button type="button" onClick={onAction} className="pm-button mt-6">
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default EmptyState;
