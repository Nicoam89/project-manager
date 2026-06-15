const ObjectiveTable = ({
  objectives,
  onDelete,
}) => {
  return (
    <table className="w-full border">
      <caption className="sr-only">
        Listado de objetivos
      </caption>
      <thead>
        <tr>
          <th scope="col">Título</th>
          <th scope="col">Estado</th>
          <th scope="col">Progreso</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {objectives.map(
          (objective) => (
            <tr key={objective._id}>
              <td>
                {objective.title}
              </td>

              <td>
                {objective.status}
              </td>

              <td>
                {objective.progress}%
              </td>

              <td>
                <button
                  onClick={() =>
                    onDelete(
                      objective._id
                    )
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default ObjectiveTable;