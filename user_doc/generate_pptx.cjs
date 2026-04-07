const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const outputPath = path.join(__dirname, 'Презентація_VogelTravel.pptx');
const titleImagePath = path.join(__dirname, '../user data/Скріни Сайту/Титул.png');

let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';

// Define Corporate Theme
const corpGreen = "0F5132";
const corpLightGreen = "D1E7DD";
const corpDark = "333333";
const corpLight = "F8F9FA";

pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: corpLight },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: 0.8, fill: { color: corpLightGreen } } },
    { text: { text: "Vogel Travel Web Platform", options: { x: 0.5, y: 0.1, w: 5, h: 0.6, fontSize: 18, color: corpGreen, fontFace: "Arial", bold: true } } },
    { rect: { x: 0, y: '92%', w: '100%', h: 0.5, fill: { color: corpGreen } } },
    { text: { text: "Premium Travel Services", options: { x: 0.5, y: '93%', w: 5, h: 0.3, fontSize: 12, color: "FFFFFF", fontFace: "Arial" } } },
  ]
});

// SLIDE 1: Title
let slideTitle = pptx.addSlide();
slideTitle.background = { color: corpLight };

let yOffset = 1.0;
if (fs.existsSync(titleImagePath)) {
  slideTitle.addImage({ path: titleImagePath, x: 1.5, y: 0.5, w: 7, h: 3.5 });
  yOffset = 4.5;
} else {
  slideTitle.addText("Vogel Travel", { x: 1.5, y: 1.5, w: 7, h: 1, fontSize: 48, color: corpGreen, bold: true, align: "center", fontFace: "Arial" });
}

slideTitle.addText("Вступ та загальний огляд платформи", { x: 1, y: yOffset, w: 8, h: 1, fontSize: 28, color: corpDark, align: "center", fontFace: "Arial" });
slideTitle.addText("Мультимедійний сервіс преміум-класу", { x: 1, y: yOffset + 0.8, w: 8, h: 0.5, fontSize: 18, color: corpGreen, align: "center", fontFace: "Arial", italic: true });

// SLIDE 2: Navigation & Header
let slideHeader = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideHeader.addText("Хедер та Навігація", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideHeader.addText([
  { text: "Ключовий навігаційний центр", options: { bullet: true } },
  { text: "Містить меню: Головна, Про нас, Послуги, Розкішні пропозиції, Партнери, Блог, Контакти", options: { bullet: true, color: corpDark } },
  { text: "Пошукова система за кліком на іконку лупи", options: { bullet: true } },
  { text: "Блок з QR-кодом для швидкого переходу у закриту Telegram-групу. Даний QR-код та посилання гнучко налаштовуються адміністратором", options: { bullet: true, bold: true } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

// SLIDE 3: Main page
let slideMain = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideMain.addText("Головна сторінка та Мапа партнерів", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideMain.addText([
  { text: "Світла презентаційна сторінка з актуальними пропозиціями", options: { bullet: true } },
  { text: "Інтерактивна мапа партнерів:", options: { bullet: true, bold: true } },
  { text: "Відображає маркери партнерів Vogel Travel по всьому світу", options: { indentLevel: 1, bullet: true } },
  { text: "Hover-ефекти для швидкої довідки (Прев'ю)", options: { indentLevel: 1, bullet: true } },
  { text: "Детальні сторінки партнерів із фотографіями послуг та пропозиціями за кліком", options: { indentLevel: 1, bullet: true } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

// SLIDE 4: Feedback Forms
let slideForms = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideForms.addText("Модальні вікна та Форми", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideForms.addText([
  { text: "Форми зворотного зв'язку:", options: { bullet: true, bold: true } },
  { text: "Загальні контактні форми та форми підбору туру", options: { indentLevel: 1, bullet: true } },
  { text: "Можливість запису голосового повідомлення прямо у формі для максимальної зручності!", options: { indentLevel: 1, bullet: true, bold: true, color: "116c43" } },
  { text: "Форма оформлення замовлення:", options: { bullet: true, bold: true } },
  { text: "Зручний date-picker у корпоративних кольорах", options: { indentLevel: 1, bullet: true } },
  { text: "Перехід до системи інвойсингу", options: { indentLevel: 1, bullet: true } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

// SLIDE 5: Billing
let slideBilling = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideBilling.addText("Система Білінгу та PDF Інвойси", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideBilling.addText([
  { text: "Автоматична генерація деталізованих рахунків (інвойсів)", options: { bullet: true } },
  { text: "Користувач бачить візуальне прев'ю документу з усіма деталями свого замовлення", options: { bullet: true } },
  { text: "Можливість збереження/завантаження (Download as PDF) безпосередньо з модального вікна", options: { bullet: true, bold: true } },
  { text: "Посилання на оплату або інтеграція з Monobank Acquiring для миттєвої оплати", options: { bullet: true } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

// SLIDE 6: Telegram Bot
let slideBot = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideBot.addText("Інтеграція з Telegram-ботом", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideBot.addText([
  { text: "Система оповіщень реального часу для адміністраторів:", options: { bullet: true, bold: true } },
  { text: "Текстові запити з форм відразу прилітають у Telegram (з необхідними форматуваннями)", options: { indentLevel: 1, bullet: true } },
  { text: "Голосові повідомлення від клієнтів автоматично пересилаються у чат як аудіофайли", options: { indentLevel: 1, bullet: true, bold: true, color: "116c43" } },
  { text: "Генерація PDF-інвойсу після оформлення автоматично дублюється та надсилається у Telegram як вкладений документ", options: { indentLevel: 1, bullet: true } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

// SLIDE 7: Search
let slideSearch = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slideSearch.addText("Глобальний пошук по сайту", { x: 0.5, y: 1.0, w: 8, h: 0.8, fontSize: 32, bold: true, color: corpGreen, fontFace: "Arial" });
slideSearch.addText([
  { text: "Доступний всюди:", options: { bullet: true, bold: true } },
  { text: "Забезпечується пошуковою панеллю в хедері або розширеним пошуком 'Розкішні пропозиції'", options: { indentLevel: 1, bullet: true } },
  { text: "Критерії пошуку:", options: { bullet: true, bold: true } },
  { text: "Швидкий пошук за іменами партнерів, країнами та ключовими словами", options: { indentLevel: 1, bullet: true } },
  { text: "Фільтри за часовими інтервалами (Date Range) та кількістю мандрівників", options: { indentLevel: 1, bullet: true } },
  { text: "Панель пошуку створює єдиний преміум вигляд, ідеально зливаючись з Hero-банером", options: { bullet: true, bold: true, color: "116c43" } }
], { x: 0.5, y: 2.0, w: 8.5, h: 3, fontSize: 20, color: corpDark, fontFace: "Arial", lineSpacing: 36 });

pptx.writeFile({ fileName: outputPath }).then(fileName => {
  console.log(`created file: ${fileName}`);
}).catch(err => {
  console.error("Error creating PPTX", err);
});
