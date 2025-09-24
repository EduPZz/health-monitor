const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  const diffDays = Math.round(
    (startOfDay(today) - startOfDay(date)) / MS_PER_DAY
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 0)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }); // futuro

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
};

export const getDaysUntil = (dateString) => {
  const today = new Date();
  const consultationDate = new Date(dateString);

  const diffDays = Math.round(
    (startOfDay(consultationDate) - startOfDay(today)) / MS_PER_DAY
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays < 0) return "Passou";
  return `Em ${diffDays} dias`;
};
