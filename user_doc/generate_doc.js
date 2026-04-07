const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak, LevelFormat, TableOfContents, UnderlineType } = require('docx');

const outputPath = path.join(__dirname, 'Презентаційні_матеріали_Vogel_Travel.docx');
const titleImagePath = path.join(__dirname, '../user data/Скріни Сайту/Титул.png');

let titleImage = null;
try {
  titleImage = fs.readFileSync(titleImagePath);
} catch (e) {
  console.log("Could not load title image:", e.message);
}

const defaultFont = "Arial";

// Helper for paragraphs
const createParagraph = (text, options = {}) => {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: options.spacing || { before: 120, after: 120 },
    children: [
      new TextRun({
        text,
        font: defaultFont,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        color: options.color || "000000"
      })
    ]
  });
};

const createHeading = (text, level) => {
  let spacingBefore = 240;
  let spacingAfter = 120;
  if (level === HeadingLevel.HEADING_1) {
    spacingBefore = 360;
    spacingAfter = 240;
  }
  return new Paragraph({
    heading: level,
    spacing: { before: spacingBefore, after: spacingAfter },
    children: [new TextRun({ text })]
  });
};

const createBullet = (text, reference = "bullet-list") => {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: defaultFont, size: 24 })]
  });
};

const children = [];

// 1. Title Page
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1440, after: 360 },
    children: [
      new TextRun({
        text: "Vogel Travel Web Platform",
        font: defaultFont,
        size: 56, // 28pt
        bold: true,
        color: "0F5132" // dark green corporate style
      })
    ]
  })
);

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 720 },
    children: [
      new TextRun({
        text: "Презентація та технічний опис функціоналу",
        font: defaultFont,
        size: 32, // 16pt
        color: "333333"
      })
    ]
  })
);

if (titleImage) {
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: titleImage,
          transformation: { width: 600, height: 350 }, // Approximation
          type: "png",
          altText: {
            name: "Титул",
            title: "Титулка Vogel Travel",
            description: "Головний екран платформи Vogel Travel"
          }
        })
      ]
    })
  );
}

children.push(new Paragraph({ children: [new PageBreak()] }));

// Table of contents
children.push(createHeading("Зміст", HeadingLevel.HEADING_1));
children.push(new TableOfContents("Зміст", {
  hyperlink: true,
  headingStyleRange: "1-3"
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Content starts here
children.push(createHeading("1. Вступ та загальна інформація", HeadingLevel.HEADING_1));
children.push(createParagraph("Платформа Vogel Travel — це сучасний, високотехнологічний та зручний мультимедійний веб-сервіс, який допомагає клієнтам швидко і комфортно замовляти туристичні послуги преміум-класу, бронювати подорожі та ефективно комунікувати з командою менеджерів."));
children.push(createParagraph("Даний документ надає повний огляд інтерфейсу та презентацію ключового функціоналу сайту, включаючи логіку користувацького флоу, форми зворотного зв'язку, систему інвойсингу та інтеграцію сповіщень."));
children.push(createParagraph("Зверніть увагу: весь текстовий і візуальний контент, зображення, параметри налаштувань, а також посилання сайту керуються та налаштовуються у зручній адміністративній панелі.", { bold: true }));
children.push(createParagraph("Детальніша інструкція щодо налаштувань контенту міститься у документі 'Інструкція адміністратора Vogel Travel.docx'.", { bold: true }));

children.push(createHeading("2. Хедер, навігація та глобальні елементи", HeadingLevel.HEADING_1));
children.push(createHeading("Елементи хедера", HeadingLevel.HEADING_2));
children.push(createParagraph("Шапка сайту (Header) є ключовим навігаційним центром, що доступний з будь-якої сторінки. Вона забезпечує швидкий доступ до основних розділів:"));
children.push(createBullet("Меню навігації (Головна, Про нас, Послуги, Розкішні пропозиції, Партнери, Блог, Контакти)."));
children.push(createBullet("Пошукова система, яка легко викликається натисканням на іконку лупи."));
children.push(createBullet("Мовні перемикачі для зручної адаптації під різні аудиторії."));

children.push(createHeading("QR-код та закрите ком'юніті", HeadingLevel.HEADING_3));
children.push(createParagraph("В хедері передбачений спеціальний блок з QR-кодом. При скануванні або кліку на нього (якщо користувач знаходиться з мобільного пристрою) відбувається швидкий перехід у закриту Telegram-групу. У майбутньому це посилання можна гнучко переналаштувати в адміністративній панелі, щоб воно вело на будь-який інший ресурс чи акцію компанії."));

children.push(createHeading("3. Головна сторінка та мапа світу з партнерами", HeadingLevel.HEADING_1));
children.push(createParagraph("Головна сторінка ефектно знайомить користувача з можливостями Vogel Travel. Вона складається з презентаційних банерів та інтерактивних блоків."));

children.push(createHeading("Інтерактивна мапа партнерів", HeadingLevel.HEADING_2));
children.push(createParagraph("Справжньою родзинкою головної сторінки є красива інтерактивна мапа світу, на якій нанесені марк(ери) партнерів Vogel Travel. Мапа дозволяє:"));
children.push(createBullet("Досліджувати широку географію співпраці компанії по всьому світу."));
children.push(createBullet("Наводити курсор на маркери та отримувати коротку довідку про партнера в обраній країні/локації."));
children.push(createBullet("Клікати по маркеру для швидкого переходу на детальну сторінку конкретного партнера."));

children.push(createParagraph("Сама сторінка партнера містить вичерпну інформацію, фотографії послуг, умови та прямі пропозиції від даного бренду."));

children.push(createHeading("4. Модальні вікна та логіка користувацьких форм", HeadingLevel.HEADING_1));
children.push(createHeading("Форми зворотного зв'язку", HeadingLevel.HEADING_2));
children.push(createParagraph("Сайт містить кілька типів форм для оперативного зв'язку та бронювання:"));
children.push(createBullet("Загальна контактна форма — для будь-яких питань (ім'я, телефон, повідомлення)."));
children.push(createBullet("Форма індивідуального підбору туру — додаткові поля для деталей, бюджету та побажань."));
children.push(createParagraph("Особливістю форм є можливість записати голосове повідомлення безпосередньо у вікні оформлення запиту. Клієнт може словами пояснити свої побажання, що робить комунікацію максимально зручною."));

children.push(createHeading("Форма замовлення послуги", HeadingLevel.HEADING_2));
children.push(createParagraph("При виборі конкретного туру або пропозиції відкривається форма оформлення замовлення. У ній користувач:"));
children.push(createBullet("Вказує свої контактні дані та коментарі до замовлення."));
children.push(createBullet("Обирає бажані дати за допомогою зручного календаря, виконаного у кольорах корпоративного стилю."));
children.push(createBullet("Підтверджує замовлення та переходить до логіки інвойсингу."));

children.push(createHeading("5. Процес оплати: Інвойсинг та завантаження", HeadingLevel.HEADING_1));
children.push(createParagraph("Vogel Travel має безшовну та прозору систему білінгу:"));
children.push(createBullet("Після успішного оформлення замовлення або послуги система автоматично формує деталізований інвойс."));
children.push(createBullet("Користувач бачить візуальне прев'ю документа, яке містить: номер замовлення, дату, деталі туру, контактну інформацію, суму та реквізити компанії."));
children.push(createBullet("Безпосередньо з вікна прев'ю інвойс можна скачати у форматі PDF для збереження та оплати у зручному для клієнта банку."));
children.push(createBullet("Надалі також доступна можливість миттєвої оплати через форму (Monobank Acquiring)."));

children.push(createHeading("6. Інтегрована логіка Telegram Боту", HeadingLevel.HEADING_1));
children.push(createParagraph("Для забезпечення високого рівня сервісу та миттєвого реагування всі сповіщення із сайту централізовано надсилаються адміністраторам через Telegram Бот компанії."));

children.push(createHeading("Типи сповіщень у Telegram:", HeadingLevel.HEADING_2));
children.push(createBullet("Нові заявки. Всі текстові звернення з усіх форм відразу прилітають менеджеру в месенджер у зручному форматованому вигляді (дата, контакти, текст повідомлення).", "bot-list"));
children.push(createBullet("Голосові повідомлення. Якщо клієнт скористався можливістю запису голосового під час заповнення форми – бот автоматично надсилає аудіофайл разом із текстом заявки. Менеджер може прослухати запит прямо в Telegram.", "bot-list"));
children.push(createBullet("Генерація інвойсів. Щойно клієнт створює інвойс, бот повідомляє про це менеджера та автоматично прикріплює згенерований PDF-інвойс до повідомлення у Telegram-чат. Таким чином, менеджер завжди має копію виставленого рахунку.", "bot-list"));

children.push(createHeading("7. Глобальний пошук по сайту", HeadingLevel.HEADING_1));
children.push(createParagraph("Сайт обладнаний швидкою системою пошуку, що допомагає легко орієнтуватись у розмаїтті послуг:"));
children.push(createBullet("Доступний як з хедера сайту, так і у вигляді окремої розширеної панелі (на сторінці 'Розкішні пропозиції').", "search-list"));
children.push(createBullet("Дозволяє шукати тури за країнами, ключовими словами, назвами турів та іменами партнерів.", "search-list"));
children.push(createBullet("Присутня система розумної фільтрації: фільтрація за часовим проміжком (через висококласний date-picker), кількістю подорожуючих та напрямком. Панель пошуку ідеально 'зливається' з головним банером, створюючи premium UX/UI відчуття.", "search-list"));


const doc = new Document({
  styles: {
    default: { document: { run: { font: defaultFont, size: 24 } } },
    paragraphStyles: [
      {
        id: "Normal", name: "Normal", basedOn: "Normal", next: "Normal",
        run: { font: defaultFont, size: 24 },
        paragraph: { spacing: { before: 120, after: 120 } }
      },
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "0F5132" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Heading1", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: "116c43" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Heading2", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "158854" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "bot-list",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "search-list",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log('Document created successfully:', outputPath);
}).catch(console.error);
