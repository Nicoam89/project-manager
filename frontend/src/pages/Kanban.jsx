import MainLayout from "../layouts/MainLayout";

import KanbanBoard from "../components/Kanban/KanbanBoard";

const Kanban = () => {
  return (
    <MainLayout>
      <KanbanBoard
        title="Kanban de metas y actividades"
        description="Consulta las metas y mueve sus actividades entre estados desde una vista integrada."
      />
    </MainLayout>
  );
};

export default Kanban;
