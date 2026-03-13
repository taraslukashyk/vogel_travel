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
  audio?: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Острови Фіджі — Серце Південного Тихого океану',
    excerpt: 'Все про архіпелаг із понад 300 островів: від клімату та правил в\u2019їзду до розкішних курортів Маманузи та Ясави.',
    date: '12.03.2026',
    image: 'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1200&q=80',
    category: 'Фіджі',
    audio: '/audio/fiji_review.wav',
    sections: [
      {
        type: 'text',
        title: 'Розташування',
        content: 'Острів Фіджі знаходиться в Південному Тихому океані, складаючи приголомшливий архіпелаг із понад 300 островів (з яких населена лише третина). Він розташований в Південній частині Тихого океану, на південь від Тихоокеанського протоки Мельтон та на заході від Міжнародної лінії зміни дати. Це справжній перехрестя полінезійської та меланезійської культур.'
      },
      {
        type: 'text',
        title: 'Клімат',
        content: 'Фіджі має ідеальний тропічний клімат з вологим літом та теплою сухою зимою. Літо триває з грудня по березень, коли середня температура становить близько 30°C, а зима - з квітня по листопад, з комфортною середньою температурою близько 26,2°C. Сухий сезон вважається найкращим часом для відвідування.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
        content: 'Ідилічний пляж архіпелагу Фіджі з кришталево чистою водою.'
      },
      {
        type: 'text',
        title: 'Мова та Валюта',
        content: 'Офіційною мовою Фіджі є англійська. Головне слово — «Bula!» (Була), що означає привітання та побажання здоров\'я. Офіційна валюта — Фіджійський долар (FJD), курс близько 1,9 FJD за 1 USD.'
      },
      {
        type: 'text',
        title: 'Час та Правила в\u2019їзду',
        content: 'Час на Фіджі (GMT+12) відрізняється від київського на 10 годин уперед. Для в\'їзду потрібен паспорт з дією мінімум 6 місяців та зворотний квиток. Щеплення від жовтої лихоманки можуть бути обов\'язковими при в\'їзді з окремих зон.'
      },
      {
        type: 'text',
        title: 'Природне Багатство та Розваги',
        content: 'Фіджі — «світова столиця м\'яких коралів», дайвінг тут — досвід на все життя. Тут є буйна тропічна рослинність, гори вулканічного походження та кришталеві водоспади серед джунглів.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?auto=format&fit=crop&w=1200&q=80',
        content: 'Підводний світ Фіджі — різнобарвні корали та тропічні рибки.'
      },
      {
        type: 'text',
        title: 'Острови Маманузи',
        content: 'Острови Маманузи — найближча до Віті-Леву група островів з розкішними курортами та ексклюзивними віллами на воді. Саме тут знімали «Вигнанець» з Томом Генксом. Любителі серфінгу знайдуть легендарні хвилі Cloudbreak.'
      },
      {
        type: 'list',
        title: 'Найпопулярніші курорти Маманузи',
        content: [
          'Likuliku Island Resort: Єдиний курорт Adults Only на Фіджі. Автентичні вілли на воді.',
          'Vomo Island Resort: Приватний острів Вомо. Елегантні вілли та 9-лунковий гольф-курт.',
          'Tadrai Island Resort: Ексклюзивний бутік-курорт для дорослих з infinity pool.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        content: 'Розкішні вілли на воді в Likuliku Island Resort.'
      },
      {
        type: 'text',
        title: 'Острови Ясава',
        content: 'Ясава — острови з білим піском і яскраво-блакитними лагунами (тут знімали «Блакитну лагуну»). Yasawa Island Resort пропонує 11 безлюдних пляжів та максимальну приватність.'
      },
      {
        type: 'text',
        title: 'Північ, Схід та Південь',
        content: 'Laucala Island Resort (6*) на півночі — ультраексклюзивний курорт зі своєю мінісубмариною та 18-лунковим гольфом. Схід (Лау) — дика природа для поціновувачів. Кадаву — рай для дайверів з Великим Астролябієвим рифом.'
      }
    ]
  },
  {
    id: 2,
    title: 'Домініканська Республіка — Карибська Мрія',
    excerpt: 'Від запальних ритмів бачати до білосніжних пляжів Баваро: все про відпочинок у Домінікані.',
    date: '10.03.2026',
    image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1200&q=80',
    category: 'Домінікана',
    audio: '/audio/dominicana_review.wav',
    sections: [
      {
        type: 'text',
        title: 'Розташування та Клімат',
        content: 'Домініканська Республіка знаходиться на острові Гіспаньола в серці Карибського моря. Клімат м\'який тропічний, середня температура від 25°C до 31°C. Сезон дощів (травень-листопад) означає лише короткі зливи вночі.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
        content: 'Білосніжні пляжі Баваро — одні з найкрасивіших у Карибському морі.'
      },
      {
        type: 'text',
        title: 'Практична Інформація',
        content: 'Офіційна мова — іспанська. Валюта — домініканське песо (DOP), долари США приймають повсюдно. Час відстає від київського на 4-6 годин. Для громадян України віза зазвичай не потрібна — електронний e-Ticket.'
      },
      {
        type: 'text',
        title: 'Електрика',
        content: 'Напруга 110 вольт, розетки американського типу (A та B). Обов\'язково знадобиться перехідник.'
      },
      {
        type: 'text',
        title: 'Природне Багатство та Розваги',
        content: 'Домінікана — це не тільки пляжі Баваро. Є також Пік Дуарте (найвища точка Карибів), тропічні ліси, водоспади Самани та підводні пещери. Острів Саона — заповідник з морськими зірками.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
        content: 'Панорамний вид на океан з терас найкращих резортів Кап-Кани.'
      },
      {
        type: 'list',
        title: 'Рекомендовані курорти: Делюкс сегмент',
        content: [
          'Finest Punta Cana / Live Aqua Beach Resort Punta Cana',
          'Sanctuary Cap Cana / Secrets Cap Cana Resort & Spa (Adults Only)',
          'Hyatt Zilara (Adults Only) / Hyatt Ziva (Families)',
          'Eden Roc / Zoetry Agua Punta Cana',
          'Nickelodeon (Найкращий вибір для сімей з дітьми)'
        ]
      },
      {
        type: 'list',
        title: 'Ціна-якість',
        content: [
          'Dreams Macao Beach Punta Cana (Чудовий пляж)',
          'Bahia Principe Fantasia (Казковий замок для дітей)',
          'Iberostar Selection Bavaro / Riu Palace Bavaro',
          'Barcelo Bavaro Palace (Ідеально для малюків)'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
        content: 'Нескінченні басейни All Inclusive резортів Пунта-Кани.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'Перельоти з Варшави, Бухареста або Будапешта (Swiss, Lufthansa) — від 42-53 тис. грн.'
      }
    ]
  },
  {
    id: 3,
    title: 'Маврикій — Перлина Індійського океану',
    excerpt: 'Острів, з якого скопіювали рай: вишукані готелі, семикольорові піски та гора Ле-Морн.',
    date: '08.03.2026',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    category: 'Маврикій',
    audio: '/audio/mauritius_review.wav',
    sections: [
      {
        type: 'text',
        title: 'Рай Марка Твена',
        content: 'Маврикій — розкішна острівна країна вулканічного походження в Індійському океані. За словами Марка Твена, рай був скопійований саме з цього острова. Клімат тропічний: літо (листопад-квітень) спекотне та вологе, зима (травень-жовтень) суха та вітряна.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        content: 'Гора Ле-Морн-Брабан — символ Маврикію, об\'єкт ЮНЕСКО.'
      },
      {
        type: 'text',
        title: 'Практична Інформація',
        content: 'Офіційні мови — англійська та французька. Валюта — маврикійська рупія (MUR). Час випереджає київський на 2-3 години. Для українців безкоштовна віза по прибуттю (до 60 днів). Розетки типу G або C.'
      },
      {
        type: 'text',
        title: 'Природне Багатство та Культура',
        content: 'Візитівка острова — гора Ле-Морн та Семикольорові піски Шамарель. Острів захищений кораловим рифом, що створює спокійні туркізові лагуни. Культура — мікс індійських, креольських та французьких традицій.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
        content: 'Туркізові лагуни Маврикію — ідеальне місце для релаксу.'
      },
      {
        type: 'list',
        title: 'Найкращі готелі по регіонах',
        content: [
          'Південь (Ле Морн): Lux Le Morne, JW Marriott Mauritius, Paradis/Dinarobin Beachcomber.',
          'Схід: One&Only Le Saint Géran, Lux Belle Mare, Shangri-La Le Touessrok.',
          'Північ: Trou Aux Biches, Royal Palm, Lux Grand Baie (ультрамодний бутік-готель).',
          'Захід: Sugar Beach, La Pirogue.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1200&q=80',
        content: 'Розкішний готельний комплекс на березі Маврикію.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'З Варшави (Emirates) від 39 тис. грн, з Кракова або Будапешта — від 35-38 тис. грн.'
      }
    ]
  },
  {
    id: 4,
    title: 'Мексика — Містика Майя та Карибські Пляжі',
    excerpt: 'Від пірамід Чичен-Іца до делюкс вілл у мангрових лісах: повний гід по Юкатану.',
    date: '05.03.2026',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    category: 'Мексика',
    audio: '/audio/mexico_review.wav',
    sections: [
      {
        type: 'text',
        title: 'Карибське узбережжя Юкатану',
        content: 'Мексика — країна контрастів, де стародавні піраміди Майя сусідять з ультрасучасними резортами Канкуна. Клімат тропічний вологий, середня температура близько 27-30°C. Найкращий час для візиту — з листопада по квітень.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=1200&q=80',
        content: 'Карибське узбережжя Рів\'єри Майя — блакитна вода і білий пісок.'
      },
      {
        type: 'text',
        title: 'Практична Інформація',
        content: 'Офіційна мова — іспанська. Валюта — мексиканське песо (MXN), долари приймають повсюдно. Час відстає від київського на 7 годин. Громадяни України в\'їжджають за електронним дозволом (SAE) до 180 днів. Напруга 127 В.'
      },
      {
        type: 'text',
        title: 'Природне багатство та Культура',
        content: 'Юкатан славиться сенотами — підземними кристальними озерами. Чичен-Іца — одне з семи нових чудес світу. Руїни Тулуму над обривом над океаном. Мексиканська кухня — спадщина ЮНЕСКО.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
        content: 'Стародавні піраміди Майя серед тропічних джунглів Юкатану.'
      },
      {
        type: 'list',
        title: 'Рекомендовані курорти',
        content: [
          'Делюкс: Rosewood Mayakoba (вілли в мангрових лісах), Banyan Tree Mayakoba, Grand Velas Riviera Maya.',
          'Ціна-якість: Secrets Maroma Beach (Adults Only), Hard Rock Hotel Cancun.',
          'Бюджетний: Catalonia Playa Maroma, Oasis Palm (Канкун), Riu Playacar.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1604999333590-617c9c53dbfd?auto=format&fit=crop&w=1200&q=80',
        content: 'Кристально чистий сенот — унікальне природне диво Юкатану.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'З Варшави або Франкфурта від 33-45 тис. грн. Прямі рейси Condor з Франкфурта — найзручніший варіант.'
      }
    ]
  },
  {
    id: 5,
    title: 'Куба — Острів Свободи, Ретро-авто та Білого Піску',
    excerpt: 'Атмосфера Гавани 50-х років та 20 км білосніжних пляжів Варадеро.',
    date: '03.03.2026',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    category: 'Куба',
    audio: '/audio/cuba_review.wav',
    sections: [
      {
        type: 'text',
        title: 'Острів Свободи',
        content: 'Куба — найбільший острів Карибського басейну. Клімат тропічний морський (+24°C взимку, до +32°C влітку). Найкращий час — з листопада по квітень. Офіційна мова — іспанська.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
        content: 'Колоніальна архітектура Гавани — живий музей під відкритим небом.'
      },
      {
        type: 'text',
        title: 'Валюта та Зв\'язок',
        content: 'Офіційна валюта — кубинське песо (CUP). Туристам рекомендується готівкові Євро — американські картки не працюють. Інтернет через скретч-картки ETECSA або безкоштовно у 5* готелях. Напруга 110 В.'
      },
      {
        type: 'text',
        title: 'Правила в\'їзду',
        content: 'Потрібна туристична картка «Tarjeta del Turista». Обов\'язкова наявність медичного страхування.'
      },
      {
        type: 'text',
        title: 'Атмосфера Куби',
        content: 'Пляжі Варадеро — 20 км білосніжного піску та бірюзового океану. Куба — це ретро-автомобілі, колоніальна Гавана, сигари, ром та запальні ритми сальси і румби.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1500051638674-bb996a0c2f1c?auto=format&fit=crop&w=1200&q=80',
        content: 'Легендарні ретро-автомобілі на вулицях колоніальної Гавани.'
      },
      {
        type: 'list',
        title: 'Готелі Варадеро',
        content: [
          '5 зірок: Royalton Hicacos (18+), Iberostar Selection Varadero (для сімей), Melia Varadero.',
          '4 зірки: Occidental Arenas Blancas (центр міста), Melia Las Antillas (16+), Roc Arenas Doradas.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
        content: 'Безкрайні пляжі Варадеро — білий пісок та бірюзовий океан.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'До Варадеро або Гавани з Варшави та Кракова (Lot + Condor) — від 39-44 тис. грн.'
      }
    ]
  },
  {
    id: 6,
    title: 'Мальдівські Острови — Абсолютний Релакс і Естетика',
    excerpt: 'Концепція «Один острів — один курорт»: гід по трансферах та найкращих резортах.',
    date: '01.03.2026',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
    category: 'Мальдіви',
    sections: [
      {
        type: 'text',
        title: 'Райські Атоли',
        content: 'Мальдіви — понад 1000 крихітних коралових островів в Індійському океані. Клімат екваторіальний (+28-30°C цілий рік). Концепція «Один острів — один курорт» забезпечує повний спокій та приватність.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
        content: 'Мальдівські атоли з висоти — смарагдові острови серед блакитного океану.'
      },
      {
        type: 'text',
        title: 'Практична Інформація',
        content: 'Мова — дхівехі, але англійська повсюдна. Валюта — долари США (руфії туристам майже не потрібні). Час випереджає київський на 2-3 години. Віза для українців безкоштовна по прибуттю (до 30 днів). Розетки типу G.'
      },
      {
        type: 'text',
        title: 'Barefoot Luxury',
        content: 'Мальдіви — еталон «barefoot luxury» (розкіш босоніж). Снорклінг з мантами, рифовими акулами та черепахами прямо біля вілли. Вілли на воді — символ мальдівського відпочинку.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1200&q=80',
        content: 'Мальдівські вілли на воді — символ розкоші та приватності.'
      },
      {
        type: 'list',
        title: 'Трансфери та Готелі',
        content: [
          'На катері (Делюкс): Patina Maldives, One & Only Reethi Rah, Waldorf Astoria, Gili Lankanfushi.',
          'На катері (5*): Baros, Hard Rock Maldives, Kuramathi, Grand Park Kodhipparu.',
          'На гідролітаку: Soneva Jani (гірки в океан), Anantara Kihavah (підводний ресторан), Lux South Ari Atoll.',
          'На внутрішніх рейсах: Raffles Maldives, Park Hyatt, Ayada Maldives.'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?auto=format&fit=crop&w=1200&q=80',
        content: 'Підводний світ Мальдів — рифові акули та барвисті риби.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'З Варшави (Flydubai / Qatar) або Будапешта (Emirates) — від 30-39 тис. грн.'
      }
    ]
  },
  {
    id: 7,
    title: 'Сейшели — Загублений Рай та Гігантські Черепахи',
    excerpt: 'Острови-заповідники, морські кокоси Коко де Мер та черепахи Альдабра.',
    date: '28.02.2026',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80',
    category: 'Сейшели',
    sections: [
      {
        type: 'text',
        title: 'Музей Еволюції',
        content: 'Сейшели — архіпелаг зі 115 гранітних та коралових островів у Індійському océані. Тут панує вічне літо (+26-32°C). Найкращі місяці — квітень та жовтень. Мови — сейшельська креольська, англійська та французька.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        content: 'Фантастичні гранітні валуни на пляжах Сейшельських островів.'
      },
      {
        type: 'text',
        title: 'Практична Інформація',
        content: 'Валюта — сейшельська рупія (SCR). Час випереджає київський на 2-3 години. Виза не потрібна. Розетки британського типу G. На паспорт ставлять штамп у формі кокоса Коко де Мер.'
      },
      {
        type: 'text',
        title: 'Природні Дива',
        content: 'Coco de Mer — унікальний морський кокос вагою до 30 кг. Гігантські черепахи Альдабра (100-150 років) вільно гуляють островами. Anse Source d\'Argent — найбільш фотографований пляж світу.'
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        content: 'Природна грація гігантських черепах на Сейшельських островах.'
      },
      {
        type: 'list',
        title: 'Популярні Острови та Курорти',
        content: [
          'Мае (Столиця): Savoy, STORY, Constance Ephelia, Four Seasons, Anantara Maia (ультрарозкіш на пагорбах).',
          'Праслін (Парк Юрського): Raffles Seychelles, Constance Lemuria (єдине 18-лункове гольф-поле), Le Duc de Praslin.',
          'Ла Діг (Романтика): Le Domaine de L\'Orangeraie (найкращий готель острова), велосипеди замість авто.',
          'Приватні острови: Six Senses Zil Pasyon, North Island (де відпочивали Вільям та Кейт).'
        ]
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        content: 'Затишні бухти острова Праслін з безлюдними пляжами.'
      },
      {
        type: 'text',
        title: 'Авіаперельоти',
        content: 'З Варшави, Берліна або Відня (Qatar / Emirates) — від 37-40 тис. грн.'
      }
    ]
  }
];