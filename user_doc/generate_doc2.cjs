const fs = require('fs');
const path = require('path');
const { imageSize: sizeOf } = require('image-size');
const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, PageBreak, LevelFormat, TableOfContents } = require('docx');

const outputPath = path.join(__dirname, 'Презентаційні_матеріали_Vogel_Travel.docx');
const screensDir = path.join(__dirname, '../user data/Скріни Сайту');

const imgDescriptions = require('./descriptions.json');

const defaultFont = "Arial";

const createParagraph = (text, options = {}) => {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: options.spacing || { before: 120, after: 120 },
    children: [
      new TextRun({ text, font: defaultFont, size: options.size || 24, bold: options.bold || false, color: options.color || "000000" })
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

const children = [];

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1000, after: 200 },
    children: [
      new TextRun({ text: "Vogel Travel Web Platform", font: defaultFont, size: 56, bold: true, color: "0F5132" })
    ]
  })
);

children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 400 },
    children: [
      new TextRun({ text: "Презентація та аналіз функціоналу на основі візуальних матеріалів", font: defaultFont, size: 32, color: "333333" })
    ]
  })
);

children.push(new Paragraph({ children: [new PageBreak()] }));

// Table of contents
children.push(createHeading("Зміст", HeadingLevel.HEADING_1));
children.push(new TableOfContents("Зміст", { hyperlink: true, headingStyleRange: "1-3" }));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Analyze images
let files = fs.readdirSync(screensDir);
// Sort so Title is first
files.sort((a, b) => {
  if (a === "Титул.png") return -1;
  if (b === "Титул.png") return 1;
  return a.localeCompare(b);
});

children.push(createHeading("Огляд розділів сайту та функціоналу", HeadingLevel.HEADING_1));
children.push(createParagraph("Нижче наведено детальний аналіз всіх ключових сторінок, модальних вікон та функціональних потоків проекту Vogel Travel. Усі блоки базуються на реальних скріншотах з платформи. Зважаючи на наведені зображення, можна оцінити як візуальний, так і технічний масштаб (календарі, інтеграцію PDF та Телеграм-сповіщень)."));

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  const ext = path.extname(file).toLowerCase();
  
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const meta = imgDescriptions[file] || { 
      title: "Функціональний блок: " + file, 
      desc: "Елемент інтерфейсу або сторінка розробленої платформи Vogel Travel." 
    };

    children.push(createHeading(meta.title, HeadingLevel.HEADING_2));
    
    // Process image
    const dimensions = sizeOf(fs.readFileSync(filePath));
    const origW = dimensions.width;
    const origH = dimensions.height;
    
    let targetW = 600;
    let targetH = Math.floor(600 * (origH / origW));

    // Constrain height so it doesn't overflow page bounds completely invisibly
    // Max Word page usable height is roughly 800px equivalent here
    if (targetH > 700) {
       targetH = 700;
       targetW = Math.floor(700 * (origW / origH));
    }

    try {
      const imgData = fs.readFileSync(filePath);
      let imgType = ext.replace('.', '');
      if (imgType === 'jpg') imgType = 'jpeg';
      
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
          children: [
            new ImageRun({
              data: imgData,
              transformation: { width: targetW, height: targetH },
              type: imgType,
              altText: {
                name: "Image",
                title: meta.title,
                description: "Screenshot of Vogel Travel"
              }
            })
          ]
        })
      );
    } catch(e) {
      console.log(`Failed to load ${file}: ${e.message}`);
    }

    children.push(createParagraph(meta.desc, { bold: false, size: 24, color: "444444" }));
    // children.push(new Paragraph({ children: [new PageBreak()] })); // Better not page break after every single small image
  }
});

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
        run: { font: defaultFont, size: 36, bold: true, color: "0F5132" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: defaultFont, size: 30, bold: true, color: "116c43" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
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
  console.log('Document extended with all images created successfully:', outputPath);
}).catch(console.error);
