export interface BlogSection {
  type: 'text' | 'image' | 'list';
  title?: string;
  content: string | string[];
  image?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Острови Фіджі: Практична Інформація для Подорожуючих',
    excerpt: 'Все, що потрібно знати про клімат, мову, валюту та правила в’їзду на архіпелаг з понад 300 островів.',
    date: '12.03.2026',
    image: 'https://images.unsplash.com/photo-1510014137619-bc78876c5b96?auto=format&fit=crop&q=80&w=1200',
    category: 'Фіджі',
    sections: [
      {
        type: 'text',
        content: 'Острів Фіджі знаходиться в Південному Тихому океані, складаючи архіпелаг із понад 300 островів. Він розташований в Південній частині Тихого океану, на південь від Тихоокеанського протоки Мельтон та на заході від Міжнародної лінії зміни дати.'
      },
      {
        type: 'text',
        title: 'Клімат',
        content: 'Фіджі має тропічний клімат з вологим літом та теплою сухою зимою. Літо триває з грудня по березень, коли середня температура становить близько 30°C, а зима - з квітня по листопад, з середньою температурою близько 26,2°C.'
      },
      {
        type: 'text',
        title: 'Мова та Валюта',
        content: 'Офіційною мовою Фіджі є англійська. Проте місцеві жителі також розмовляють між собою на фіджійській та хінді. Офіційною валютою Фіджі є Фіджійський долар (FJD). Орієнтовний курс становить близько 1,9-1,8 FJD за 1 USD.'
      },
      {
        type: 'text',
        title: 'Острови Маманузи',
        content: 'Відомі своїми розкішними курортами та ексклюзивними віллами на воді. Багаті коралові рифи навколо островів надають чудові можливості для сноркелінгу та дайвінгу.'
      },
      {
        type: 'list',
        title: 'Найпопулярніші курорти Маманузи',
        content: [
          'Likuliku Island Resort: Єдиний курорт на Фіджі з віллами на воді для дорослих.',
          'Vomo Island Resort: Елегантні вілли та приватний гольф-курт.',
          'Tadrai Island Resort: Ексклюзивний відпочинок виключно для пар.'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Домініканська Республіка: Рай на острові Гіспаньола',
    excerpt: 'Огляд найкращих курортів від делюкс сегменту до бюджетних варіантів у Карибському морі.',
    date: '10.03.2026',
    image: 'https://images.unsplash.com/photo-1544607567-33f78939634d?auto=format&fit=crop&q=80&w=1200',
    category: 'Домінікана',
    sections: [
      {
        type: 'text',
        content: 'Домініканська Республіка славиться своєю природною красою, включаючи пляжі з білим піском, гори, тропічні ліси та водоспади.'
      },
      {
        type: 'list',
        title: 'Делюкс сегмент',
        content: [
          'Finest Punta Cana',
          'Sanctuary Cap Cana',
          'Secrets Cap Cana Resort & Spa',
          'Eden Roc',
          'Zoetry Agua Punta Cana'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Маврикій: Скарб Індійського океану',
    excerpt: 'Білі пляжі, туркізові лагуни та унікальна флора острова на схід від Мадагаскару.',
    date: '08.03.2026',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1200',
    category: 'Маврикій',
    sections: [
      {
        type: 'text',
        content: 'Маврикій має тропічний клімат з двома основними сезонами. Офіційними мовами є креольська та французька, англійська широко використовується в туризмі.'
      },
      {
        type: 'list',
        title: 'Рекомендовані готелі (Південь - Ле Морн)',
        content: [
          'Lux Le Morne 5*',
          'JW Marriott Mauritius 5*',
          'Paradis Beachcomber 5*',
          'Dinarobin Beachcomber 5*'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Мексика: Від тропіків до пустель',
    excerpt: 'Зручні перельоти та найкращі готелі Рів\'єри Майя та Канкуна.',
    date: '05.03.2026',
    image: 'https://images.unsplash.com/photo-1512813583167-3501658c7b02?auto=format&fit=crop&q=80&w=1200',
    category: 'Мексика',
    sections: [
      {
        type: 'text',
        content: 'Мексика розташована в Північній Америці та пропонує різноманітний клімат. Вздовж Карибського моря середня температура становить 27°C.'
      },
      {
        type: 'list',
        title: 'Делюкс сегмент',
        content: [
          'Rosewood Mayakoba',
          'Banyan Tree Mayakoba',
          'Grand Velas Riviera Maya'
        ]
      }
    ]
  }
];
