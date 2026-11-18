/**
 * Reference DOCX Report Generator Template
 * Assembles an executive-ready Word report using the `docx` library.
 */

const fs = require('fs');
const path = require('path');
const docx = require('docx');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType
} = docx;

// Standard printable body width in DXA (8.5in - 2*1000 margin) = 10240 DXA
const TOTAL_PAGE_WIDTH_DXA = 10240;

function createStatusBadge(text = 'PASS') {
  const isPass = text === 'PASS';
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: [
      new TextRun({ text: 'Status: ', bold: true, size: 20 }),
      new TextRun({
        text: ` [ ${text} ] `,
        bold: true,
        size: 20,
        color: isPass ? '385723' : 'C00000',
        shading: {
          type: ShadingType.CLEAR,
          fill: isPass ? 'E2F0D9' : 'FCE4D6'
        }
      })
    ]
  });
}

function createImage(screenshotDir, filename, width = 560, height = 350) {
  const fullPath = path.join(screenshotDir, filename);
  if (!fs.existsSync(fullPath)) {
    return new Paragraph({
      children: [new TextRun({ text: `[Image not found: ${filename}]`, italics: true, color: 'FF0000' })]
    });
  }
  const imageBuffer = fs.readFileSync(fullPath);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 100 },
    children: [
      new ImageRun({
        data: imageBuffer,
        transformation: { width, height }
      })
    ]
  });
}

function createCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 180 },
    children: [
      new TextRun({
        text: `Figure: ${text}`,
        italics: true,
        size: 18,
        color: '555555'
      })
    ]
  });
}

async function buildDocxReport({
  title,
  subtitle,
  date,
  targetApp,
  matrixData,
  scenarioSections,
  outputPath
}) {
  const cellBorder = {
    color: 'BDD7EE',
    size: 4,
    style: BorderStyle.SINGLE
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 21, color: '262626' },
          paragraph: { spacing: { line: 276, before: 60, after: 60 } }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: `${title} | UAT Execution Report`,
                    font: 'Calibri',
                    size: 16,
                    color: '8C959F'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: 'Page ', size: 16, color: '8C959F' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '8C959F' }),
                  new TextRun({ text: ' of ', size: 16, color: '8C959F' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '8C959F' })
                ]
              })
            ]
          })
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: title, bold: true, size: 36, color: '1F4E79' })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [new TextRun({ text: subtitle, bold: true, size: 24, color: '2E75B6' })]
          }),
          // Assemble additional report sections and tables...
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`[Generated]: ${outputPath}`);
}

module.exports = {
  buildDocxReport,
  createStatusBadge,
  createImage,
  createCaption,
  TOTAL_PAGE_WIDTH_DXA
};
