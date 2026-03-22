export interface OfferSection {
  type: 'text' | 'image' | 'list';
  title?: string;
  content: string | string[];
  image?: string;
  alt?: string;
}

export interface Offer {
  id: number;
  location: string;
  hotel: string;
  image: string;
  imageAlt?: string;
  bookBy: string;
  stayFrom: string;
  stayTo: string;
  discount: string;
  description?: string;
  sections?: OfferSection[];
  seoTitle?: string;
  seoDescription?: string;
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
        content: 'У ресторані Sea Grill ви зможете насолодитися свіжовиловленими морепродуктами та стейками на фоні заходу сонця. А для особливих моментів мы організовуємо приватні вечері на пляжі під зоряним небом.'
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
    description: 'Відкрийте для себе втілення кікладської розкоші на мальовничих схилах Ії. Canaves Oia Suites поєднує білосніжну архітектуру, панорамні басейни та захоплюючий вид на Кальдеру, створюючи ідеальну атмосферу для романтичної втечі.',
    sections: [
      {
        type: 'text',
        title: 'Естетика Білого та Блакитного',
        content: 'Canaves Oia Suites розташований у колишніх винних погребах XVII століття, які були дбайливо перетворені на вишукані люкси. Кожен куточок цього готелю — це витвір мистецтва, що підкреслює природну красу Санторіні.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
        content: 'Класична архітектура Санторіні з видом на море.'
      },
      {
        type: 'list',
        title: 'Ваші ексклюзивні можливості',
        content: [
          'Приватні басейни-інфініті в кожному люксі з видом на Кальдеру.',
          'Вишукані вечері під зірками в ресторані Petra.',
          'Власна розкішна яхта для круїзів навколо острова.',
          'SPA-процедури з використанням натуральних грецьких компонентів.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
        content: 'Захоплюючий захід сонця, за яким можна спостерігати прямо з тераси.'
      }
    ]
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
    description: 'Нова легенда Дубая на Пальмі Джумейра. Atlantis The Royal — це архітектурний шедевр, що пропонує ультра-розкішний відпочинок, 17 ресторанів від зіркових шеф-кухарів та басейни, що немов левітують у повітрі.',
    sections: [
      {
        type: 'text',
        title: 'Масштаб вражень',
        content: 'Atlantis The Royal змінює уяву про розкіш. Це вертикальний оазис, де кожна деталь — від золотих скульптур до унікальних акваріумів — створена, щоб дивувати. Відчуйте себе на вершині світу в одному з найбільш обговорюваних готелів планети.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=1200&q=80',
        content: 'Футуристичний дизайн готелю став символом нового Дубая.'
      },
      {
        type: 'list',
        title: 'Ультра-можливості готелю',
        content: [
          'Cloud 22 — легендарний басейн на 22-му поверсі з панорамою на все місто.',
          'Доступ до найбільшого у світі аквапарку Aquaventure.',
          'Шоу вогню та води Skyblaze — перший фонтан такого типу на Близькому Сході.',
          'Wellness-центр AWAKEN з індивідуальними програмами оздоровлення.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80',
        content: 'Розкішні інтер\'єри, що поєднують сучасне мистецтво та комфорт.'
      }
    ]
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
    description: 'Відчуйте гармонію балійських традицій та бездоганного сервісу в затоці Джимбаран. Four Seasons пропонує приватні вілли серед тропічних садів та унікальні культурні враження на березі океану.',
    sections: [
      {
        type: 'text',
        title: 'Святилище Балійської Душі',
        content: 'Розташований на схилах пагорба біля океану, курорт спроектований у стилі традиційного балійського селища. Тут ви зможете зануритися в атмосферу спокою, оточені мистецвтом та щирою гостинністю місцевих жителів.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1551882547-ff43c61f3630?auto=format&fit=crop&w=1200&q=80',
        content: 'Приватна вілла з басейном серед тропічної зелені.'
      },
      {
        type: 'list',
        title: 'Що на вас чекає?',
        content: [
          'Процедури у Healing Village Spa, засновані на стародавніх балійських ритуалах.',
          'Кулінарна школа Sundara для знайомства з місцевою гастрономією.',
          'Уроки серфінгу від професіоналів прямо на домашньому пляжі.',
          'Йога на скелі під шум хвиль затоки Джимбаран.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
        content: 'Традиційний балійський храм на території курорту'
      }
    ]
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
    description: 'Ваш приватний притулок серед гранітних скель та пишних джунглів острова Мае. Four Seasons Seychelles — це вілли-будиночки на деревах з панорамним видом на Petit Anse, одну з найкрасивіших бухт світу.',
    sections: [
      {
        type: 'text',
        title: 'Усамітнення на Верхівках Джунглів',
        content: 'Прокидатися під спів екзотичних птахів та шум океану — це реальність у Four Seasons Seychelles. Гранітні скелі створюють природний щит для вашої приватності, а лазурова вода бухти манить до привітання з океаном.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200&q=80',
        content: 'Вид на бухту Petit Anse, де пісок немов цукрова пудра.'
      },
      {
        type: 'list',
        title: 'Насолода островом',
        content: [
          'Hilltop Spa — SPA з видом на 360 градусів на вершині пагорба.',
          'Дайвінг та снорклінг у кришталево чистих водах заповідника.',
          'Креольська кухня в ресторані ZEZ на фоні заходу сонця.',
          'Програма збереження морських черепах на території готелю.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        content: 'Дика природа Сейшел у поєднанні з бездоганним сервісом.'
      }
    ]
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
    description: 'Альпійський затишок і вишукана азійська естетика в серці Швейцарії. The Chedi Andermatt пропонує розкішний досвід відпочинку в Альпах з власними камінами, вишуканим SPA та гастрономією Michelin.',
    sections: [
      {
        type: 'text',
        title: 'Шедевр Жана-Мішеля Геті',
        content: 'The Chedi Andermatt — це місце, де темне дерево, натуральний камінь та м\'яке світло камінів створюють атмосферу абсолютної розкоші. Це більше ніж готель — це простір для відновлення сил серед величних швейцарських гір.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1517176118179-65244ad0e59a?auto=format&fit=crop&w=1200&q=80',
        content: 'Відкритий термальний басейн з видом на снігові вершини.'
      },
      {
        type: 'list',
        title: 'Унікальні враження',
        content: [
          'Японський ресторан з зірками Michelin на висоті понад 2000 метрів.',
          'Власна колекція сирів у скляній вежі The Restaurant.',
          'SPA-центр площею 2400 м² з гідротермальними басейнами.',
          'Скі-баттлери, які підготують ваше спорядження для ідеального катання.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
        content: 'Затишні інтер\'єри, що зігрівають після дня на схилах.'
      }
    ]
  },
];
