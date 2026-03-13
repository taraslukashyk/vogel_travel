export interface OfferSection {
  type: 'text' | 'image' | 'list';
  title?: string;
  content: string | string[];
  image?: string;
}

export interface Offer {
  id: number;
  location: string;
  hotel: string;
  image: string;
  bookBy: string;
  stayFrom: string;
  stayTo: string;
  discount: string;
  description?: string;
  sections?: OfferSection[];
}

export const offers: Offer[] = [
  {
    id: 1,
    location: 'Мальдіви',
    hotel: 'Dusit Thani Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200',
    bookBy: '12/04',
    stayFrom: '05/05',
    stayTo: '30/09',
    discount: '-60%',
    description: 'Втеча до раю, де бірюзові води атолу Баа зустрічаються з легендарною тайською гостинністю. Dusit Thani Maldives поєднує в собі вишукану розкіш та незайману природу біосферного заповідника ЮНЕСКО.',
    sections: [
      {
        type: 'text',
        title: 'Острів Мудду: Серце океану',
        content: 'Розташований на мальовничому острові Мудду, курорт пропонує унікальний досвід усамітнення. Тут кожен світанок дарує нові емоції, а вечори наповнені шепотом хвиль та ароматом тропічних квітів. Це ідеальне місце для тих, хто шукає гармонію з собою та природою.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
        content: 'Вид на безкрайній океан з вашої приватної тераси.'
      },
      {
        type: 'list',
        title: 'Що робить цей курорт особливим?',
        content: [
          'Домашній риф світового класу, де можна зустріти черепах та скатів прямо біля берега.',
          'Devarana Spa — процедурні кабінети в кронах дерев з панорамним видом.',
          'Автентичний тайський ресторан Benjarong, що вважається одним з кращих на Мальдівах.',
          'Персональний батлер, який подбає про кожну деталь вашого відпочинку.'
        ]
      },
      {
        type: 'text',
        title: 'Смак екзотики',
        content: 'У ресторані Sea Grill ви зможете насолодитися свіжовиловленими морепродуктами та стейками на фоні заходу сонця. А для особливих моментів ми організовуємо приватні вечері на пляжі під зоряним небом.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        content: 'Романтична атмосфера вечірнього пляжу.'
      }
    ]
  },
  {
    id: 2,
    location: 'Греція, Санторіні',
    hotel: 'Canaves Oia Suites',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200',
    bookBy: '20/04',
    stayFrom: '01/06',
    stayTo: '15/10',
    discount: '-45%',
  },
  {
    id: 3,
    location: 'ОАЕ, Дубай',
    hotel: 'Atlantis The Royal',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    bookBy: '05/05',
    stayFrom: '10/06',
    stayTo: '31/08',
    discount: '-35%',
  },
  {
    id: 4,
    location: 'Індонезія, Балі',
    hotel: 'Four Seasons Resort Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
    bookBy: '15/04',
    stayFrom: '01/05',
    stayTo: '30/07',
    discount: '',
  },
  {
    id: 5,
    location: 'Сейшельські Острови',
    hotel: 'Four Seasons Seychelles',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=1200',
    bookBy: '25/04',
    stayFrom: '15/06',
    stayTo: '20/09',
    discount: '',
  },
  {
    id: 6,
    location: 'Швейцарія, Альпи',
    hotel: 'The Chedi Andermatt',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
    bookBy: '30/04',
    stayFrom: '01/12',
    stayTo: '15/03',
    discount: '',
  },
];
