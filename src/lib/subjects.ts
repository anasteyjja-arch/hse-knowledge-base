export interface Professor {
  name: string;
  fullName?: string;
  hseUrl?: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  year: 1 | 2;
  professors: Professor[];
  description?: string;
}

export const subjects: Subject[] = [
  // 1 курс
  {
    id: "osnovy-menedzhmenta",
    name: "Основы современного менеджмента",
    year: 1,
    professors: [{
      name: "Филонович С.Р.",
      fullName: "Филонович Сергей Ростиславович",
      hseUrl: "https://www.hse.ru/staff/filonovich",
      description: "Профессор, доктор физико-математических наук. Один из ведущих специалистов в области менеджмента и организационного поведения в России."
    }],
  },
  {
    id: "metody-issledovaniy",
    name: "Методы социальных исследований",
    year: 1,
    professors: [{
      name: "Озерова М.В.",
      fullName: "Озерова Мария Вячеславовна",
      hseUrl: "https://www.hse.ru/staff/mozerova",
      description: "Старший преподаватель Института образования НИУ ВШЭ. Специалист в области методологии социальных исследований в образовании."
    }],
  },
  {
    id: "masterskaya",
    name: "Мастерская: секреты и загадки образования",
    year: 1,
    professors: [{
      name: "Каспржак А.Г.",
      fullName: "Каспржак Анатолий Георгиевич",
      hseUrl: "https://www.hse.ru/staff/kasprzhak",
      description: "Профессор, научный руководитель магистратуры «Управление образованием». Заслуженный учитель РФ, эксперт в области образовательной политики."
    }],
  },
  {
    id: "istoriya-pedagogiki",
    name: "История педагогической мысли и реформы образования",
    year: 1,
    professors: [{
      name: "Федоров О.Д.",
      fullName: "Федоров Олег Дмитриевич",
      hseUrl: "https://www.hse.ru/staff/odfedorov",
      description: "Доцент Института образования НИУ ВШЭ. Специалист по истории образования и образовательных реформ."
    }],
  },
  {
    id: "sociologicheskie-teorii",
    name: "Социологические теории в исследованиях образования",
    year: 1,
    professors: [{
      name: "Груздев И.А.",
      fullName: "Груздев Иван Андреевич",
      hseUrl: "https://www.hse.ru/staff/gruzdev",
      description: "Директор Центра социологии высшего образования Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "ai-v-obrazovanii",
    name: "Искусственный интеллект в управлении образованием",
    year: 1,
    professors: [{
      name: "Карлов И.А.",
      fullName: "Карлов Иван Александрович",
      hseUrl: "https://www.hse.ru/staff/ikarlov",
      description: "Директор Центра цифровых технологий в образовании Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "effektivnaya-shkola",
    name: "Эффективная школа: модель, практики, инструменты",
    year: 1,
    professors: [{
      name: "Голубицкий А.В.",
      fullName: "Голубицкий Алексей Владимирович",
      description: "Преподаватель программы «Управление образованием» НИУ ВШЭ."
    }],
  },
  {
    id: "teoriya-upravleniya",
    name: "Теория и практика управления образовательными системами",
    year: 1,
    professors: [{
      name: "Силина Л.В.",
      fullName: "Силина Людмила Владимировна",
      description: "Преподаватель программы «Управление образованием» НИУ ВШЭ."
    }],
  },
  {
    id: "seminar-nastavnika",
    name: "Семинар наставника",
    year: 1,
    professors: [{
      name: "Исаева Н.В.",
      fullName: "Исаева Наталья Викторовна",
      hseUrl: "https://www.hse.ru/staff/nisaeva",
      description: "Академический руководитель магистратуры «Управление образованием», доцент Института образования НИУ ВШЭ."
    }],
  },
  // 2 курс
  {
    id: "nis",
    name: "Научно-исследовательский семинар (НИС)",
    year: 2,
    professors: [
      {
        name: "Исаева Н.В.",
        fullName: "Исаева Наталья Викторовна",
        hseUrl: "https://www.hse.ru/staff/nisaeva",
        description: "Академический руководитель магистратуры «Управление образованием», доцент Института образования НИУ ВШЭ."
      },
      {
        name: "Озерова М.В.",
        fullName: "Озерова Мария Вячеславовна",
        hseUrl: "https://www.hse.ru/staff/mozerova",
        description: "Старший преподаватель Института образования НИУ ВШЭ."
      },
      {
        name: "Серёгин К.С.",
        fullName: "Серёгин Кирилл Сергеевич",
        hseUrl: "https://www.hse.ru/staff/kseregin",
        description: "Преподаватель Института образования НИУ ВШЭ. Специалист в области образовательной среды."
      },
    ],
  },
  {
    id: "biznes-instrumenty",
    name: "Бизнес-инструменты в управлении образованием",
    year: 2,
    professors: [{
      name: "Гизи А.С.",
      fullName: "Гизи Александра Сергеевна",
      hseUrl: "https://www.hse.ru/staff/agizi",
      description: "Преподаватель Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "upravlenie-personalom",
    name: "Управление персоналом в образовательных организациях",
    year: 2,
    professors: [{
      name: "Зеленова О.И.",
      fullName: "Зеленова Ольга Игоревна",
      hseUrl: "https://www.hse.ru/staff/ozelenova",
      description: "Доцент НИУ ВШЭ. Специалист в области управления персоналом и организационного развития."
    }],
  },
  {
    id: "praktikum-liderstva",
    name: "Практикум лидерства",
    year: 2,
    professors: [{
      name: "Кобцева А.А.",
      fullName: "Кобцева Анастасия Андреевна",
      hseUrl: "https://www.hse.ru/staff/akobtseva",
      description: "Преподаватель Института образования НИУ ВШЭ. Эксперт в области лидерства и развития soft skills."
    }],
  },
  {
    id: "dizayn-programm",
    name: "Дизайн образовательных программ",
    year: 2,
    professors: [{
      name: "Исаева Н.В.",
      fullName: "Исаева Наталья Викторовна",
      hseUrl: "https://www.hse.ru/staff/nisaeva",
      description: "Академический руководитель магистратуры «Управление образованием»."
    }],
  },
  {
    id: "kino-klub",
    name: "Кино-клуб на тему образования",
    year: 2,
    professors: [{
      name: "Клягин А.В.",
      fullName: "Клягин Алексей Владимирович",
      hseUrl: "https://www.hse.ru/staff/aklyagin",
      description: "Научный сотрудник Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "klub-direktora",
    name: "Клуб читающего директора",
    year: 2,
    professors: [{
      name: "Пазынин В.В.",
      fullName: "Пазынин Валерий Вячеславович",
      hseUrl: "https://www.hse.ru/staff/vpazynin",
      description: "Преподаватель Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "obrazovatelnaya-sreda",
    name: "Образовательная среда: управление и дизайн",
    year: 2,
    professors: [{
      name: "Серёгин К.С.",
      fullName: "Серёгин Кирилл Сергеевич",
      hseUrl: "https://www.hse.ru/staff/kseregin",
      description: "Преподаватель Института образования НИУ ВШЭ. Специалист в области образовательной среды."
    }],
  },
  {
    id: "upravlenie-kollektivom",
    name: "Управление развитием педагогического коллектива: прикладная андрагогика",
    year: 2,
    professors: [{
      name: "Федоров О.Д.",
      fullName: "Федоров Олег Дмитриевич",
      hseUrl: "https://www.hse.ru/staff/odfedorov",
      description: "Доцент Института образования НИУ ВШЭ."
    }],
  },
  {
    id: "ai-no-code",
    name: "AI и no-code для менеджмента: автоматизация рутины",
    year: 2,
    professors: [{
      name: "Бурова М.Б.",
      fullName: "Бурова Маргарита Борисовна",
      description: "Преподаватель программы. Специалист по автоматизации и AI-инструментам в управлении."
    }],
  },
];
