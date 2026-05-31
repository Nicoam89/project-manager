const ObjectiveTable = ({
  objectives,
  onDelete,
}) => {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Título</th>
          <th>Estado</th>
          <th>Progreso</th>
          <th>Acciones</th>
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