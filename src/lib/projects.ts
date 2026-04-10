export interface ProjectType {
  id: string;
  name: string;
  icon: string;
  description: string;
  isGroup: boolean;
}

export const projectTypes: ProjectType[] = [
  {
    id: "vkr",
    name: "ВКР",
    icon: "📝",
    description: "Выпускная квалификационная работа — индивидуальный исследовательский проект",
    isGroup: false,
  },
  {
    id: "praktika",
    name: "Практика",
    icon: "🏢",
    description: "Производственная и учебная практика — прикладной проект в образовательной организации",
    isGroup: false,
  },
  {
    id: "masterskaya",
    name: "Мастерская",
    icon: "🔧",
    description: "Групповой проект мастерской — совместная работа над реальной задачей в образовании",
    isGroup: true,
  },
];
