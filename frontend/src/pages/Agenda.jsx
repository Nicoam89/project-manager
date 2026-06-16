import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { getAgenda } from "../api/dashboard";

import MainLayout from "../layouts/MainLayout";

const formatDate = (date) =>
  new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
  }).format(new Date(date));

const getItemPath = (item) =>
  item.type === "GOAL"
    ? `/goals/${item.id}`
    : `/activities/${item.id}`;

const getItemTypeLabel = (type) =>
  type === "GOAL" ? "Meta" : "Actividad";

const getDueText = (daysUntilDue) => {
  if (daysUntilDue < 0) {
    return `Venció hace ${Math.abs(daysUntilDue)} día${Math.abs(daysUntilDue) === 1 ? "" : "s"}`;
  }

  if (daysUntilDue === 0) {
    return "Vence hoy";
  }

  return `Vence en ${daysUntilDue} día${daysUntilDue === 1 ? "" : "s"}`;
};

const AgendaItem = ({ item }) => {
  const isOverdue = item.urgency === "OVERDUE";

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isOverdue
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {isOverdue ? "Vencida" : "Próxima"}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {getItemTypeLabel(item.type)}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-950">
            {item.title}
          </h2>

          {item.description && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {item.description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-2 text-left sm:text-right">
          <p className="text-sm font-semibold text-slate-900">
            {formatDate(item.dueDate)}
          </p>
          <p
            className={`text-xs font-medium ${
              isOverdue ? "text-red-600" : "text-amber-600"
            }`}
          >
            {getDueText(item.daysUntilDue)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-slate-500">
          <span className="font-semibold text-slate-700">
            {item.type === "GOAL" ? "Objetivo" : "Meta"}:
          </span>{" "}
          {item.parent}
        </div>

        <Link
          to={getItemPath(item)}
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
};

const Agenda = () => {
  const [agenda, setAgenda] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAgenda = async () => {
      try {
        const agendaData = await getAgenda();

        setAgenda(agendaData);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "No se pudo cargar la agenda"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAgenda();
  }, []);

  const groupedItems = useMemo(
    () => ({
      overdue:
        agenda?.items?.filter(
          (item) => item.urgency === "OVERDUE"
        ) || [],
      dueSoon:
        agenda?.items?.filter(
          (item) => item.urgency === "DUE_SOON"
        ) || [],
    }),
    [agenda]
  );

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-slate-500">Cargando agenda...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="pm-page-title">Agenda</h1>
          <p className="mt-2 text-slate-500">
            Solo se muestran actividades y metas vencidas o próximas a vencer en los próximos {agenda?.dueSoonDays || 7} días.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-64">
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center">
            <p className="text-2xl font-bold text-red-700">
              {agenda?.totals?.overdue || 0}
            </p>
            <p className="text-xs font-semibold text-red-700">
              Vencidas
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-700">
              {agenda?.totals?.dueSoon || 0}
            </p>
            <p className="text-xs font-semibold text-amber-700">
              Próximas
            </p>
          </div>
        </div>
      </div>

      {agenda?.items?.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Vencidas
            </h2>
            <div className="space-y-4">
              {groupedItems.overdue.length ? (
                groupedItems.overdue.map((item) => (
                  <AgendaItem key={`${item.type}-${item.id}`} item={item} />
                ))
              ) : (
                <p className="rounded-xl border bg-white p-4 text-slate-500">
                  No hay elementos vencidos.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Próximas a vencer
            </h2>
            <div className="space-y-4">
              {groupedItems.dueSoon.length ? (
                groupedItems.dueSoon.map((item) => (
                  <AgendaItem key={`${item.type}-${item.id}`} item={item} />
                ))
              ) : (
                <p className="rounded-xl border bg-white p-4 text-slate-500">
                  No hay elementos próximos a vencer.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No hay pendientes urgentes
          </h2>
          <p className="mt-2 text-slate-500">
            Las metas y actividades activas no están vencidas ni próximas a vencer.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Agenda;
