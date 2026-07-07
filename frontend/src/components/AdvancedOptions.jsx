const AdvancedOptions = ({ children, summary = "Opciones avanzadas" }) => (
  <details className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
    <summary className="cursor-pointer text-sm font-semibold text-slate-700">
      {summary}
      <span className="ml-2 font-normal text-slate-500">
        para ajustar detalles opcionales
      </span>
    </summary>

    <div className="mt-4 space-y-4">{children}</div>
  </details>
);

export default AdvancedOptions;
