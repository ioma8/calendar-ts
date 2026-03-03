import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { CZECH_DAYNAMES, CZECH_MONTHS, generateCalendarData, type CalendarData } from './calendar';
import fs from 'fs/promises';
import path from 'path';

export interface PdfGenerationOptions {
  year: number;
  month: number;
}

type PdfColor = ReturnType<typeof rgb>;

interface ColorPalette {
  primaryColor: PdfColor;
  headerColor: PdfColor;
  weekendColor: PdfColor;
  borderColor: PdfColor;
  lightBorderColor: PdfColor;
}

interface CalendarFonts {
  titleFont: PDFFont;
  headerFont: PDFFont;
  textFont: PDFFont;
}

interface GridMetrics {
  startX: number;
  startY: number;
  cellWidth: number;
  cellHeight: number;
}

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const TITLE_Y = 545;
const TITLE_SIZE = 28;

const GRID = {
  startX: 50,
  startY: 520,
  width: 742,
  height: 480,
} as const;

const DAY_NAME_SIZE = 11;
const DAY_NAME_Y_OFFSET = 3;
const CURRENT_DAY_SIZE = 14;
const ADJACENT_DAY_SIZE = 12;
const DAY_NUMBER_X_OFFSET = 8;
const DAY_NUMBER_Y_OFFSET = 18;
const HEADER_BORDER_WIDTH = 1.2;
const CELL_BORDER_WIDTH = 0.8;

const FONT_FILES = {
  regular: 'static/OpenSans-Regular.ttf',
  bold: 'static/OpenSans-Bold.ttf',
} as const;

const COLORS: ColorPalette = {
  primaryColor: rgb(0.15, 0.35, 0.65),
  headerColor: rgb(0.95, 0.97, 1),
  weekendColor: rgb(0.98, 0.98, 1),
  borderColor: rgb(0.3, 0.3, 0.3),
  lightBorderColor: rgb(0.5, 0.5, 0.5),
};

async function loadFont(fontPath: string): Promise<Uint8Array> {
  const fullPath = path.join(process.cwd(), 'public', 'fonts', fontPath);
  const fontBuffer = await fs.readFile(fullPath);
  return new Uint8Array(fontBuffer);
}

async function createPdfDocument(): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  const fontkitModule = await import('fontkit');
  const fontkit = ('default' in fontkitModule ? fontkitModule.default : fontkitModule) as Parameters<
    PDFDocument['registerFontkit']
  >[0];
  pdfDoc.registerFontkit(fontkit);
  return pdfDoc;
}

async function embedFonts(pdfDoc: PDFDocument): Promise<CalendarFonts> {
  const regularFontBytes = await loadFont(FONT_FILES.regular);
  const boldFontBytes = await loadFont(FONT_FILES.bold);

  const titleFont = await pdfDoc.embedFont(boldFontBytes);
  const headerFont = await pdfDoc.embedFont(boldFontBytes);
  const textFont = await pdfDoc.embedFont(regularFontBytes);

  return { titleFont, headerFont, textFont };
}

function computeGridMetrics(weeksCount: number): GridMetrics {
  return {
    startX: GRID.startX,
    startY: GRID.startY,
    cellWidth: GRID.width / 7,
    cellHeight: GRID.height / (weeksCount + 1),
  };
}

function drawCalendarTitle(page: PDFPage, month: number, year: number, titleFont: PDFFont): void {
  const title = `${CZECH_MONTHS[month - 1]} ${year}`;
  const titleWidth = titleFont.widthOfTextAtSize(title, TITLE_SIZE);

  page.drawText(title, {
    x: (PAGE_WIDTH - titleWidth) / 2,
    y: TITLE_Y,
    size: TITLE_SIZE,
    font: titleFont,
    color: COLORS.primaryColor,
  });
}

function drawHeaderRow(
  page: PDFPage,
  startX: number,
  startY: number,
  cellWidth: number,
  cellHeight: number,
  headerFont: PDFFont
): void {
  for (let col = 0; col < 7; col += 1) {
    const x = startX + col * cellWidth;
    const y = startY;

    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      color: COLORS.headerColor,
    });

    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      borderColor: COLORS.borderColor,
      borderWidth: HEADER_BORDER_WIDTH,
    });

    const dayName = CZECH_DAYNAMES[col];
    const dayNameWidth = headerFont.widthOfTextAtSize(dayName, DAY_NAME_SIZE);

    page.drawText(dayName, {
      x: x + (cellWidth - dayNameWidth) / 2,
      y: y - cellHeight / 2 - DAY_NAME_Y_OFFSET,
      size: DAY_NAME_SIZE,
      font: headerFont,
      color: COLORS.primaryColor,
    });
  }
}

function drawCalendarDays(
  page: PDFPage,
  calendarData: CalendarData,
  startX: number,
  startY: number,
  cellWidth: number,
  cellHeight: number,
  textFont: PDFFont
): void {
  for (let weekIndex = 0; weekIndex < calendarData.weeks.length; weekIndex += 1) {
    const week = calendarData.weeks[weekIndex];
    const weekY = startY - (weekIndex + 1) * cellHeight;

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const day = week.days[dayIndex];
      const x = startX + dayIndex * cellWidth;

      if ((dayIndex === 5 || dayIndex === 6) && day.isCurrentMonth) {
        page.drawRectangle({
          x,
          y: weekY - cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: COLORS.weekendColor,
        });
      }

      page.drawRectangle({
        x,
        y: weekY - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: COLORS.lightBorderColor,
        borderWidth: CELL_BORDER_WIDTH,
      });

      if (day.isCurrentMonth) {
        page.drawText(day.day.toString(), {
          x: x + DAY_NUMBER_X_OFFSET,
          y: weekY - DAY_NUMBER_Y_OFFSET,
          size: CURRENT_DAY_SIZE,
          font: textFont,
          color: dayIndex === 5 || dayIndex === 6 ? rgb(0.4, 0.4, 0.4) : rgb(0.2, 0.2, 0.2),
        });
      } else if (!day.isPadding) {
        page.drawText(day.day.toString(), {
          x: x + DAY_NUMBER_X_OFFSET,
          y: weekY - DAY_NUMBER_Y_OFFSET,
          size: ADJACENT_DAY_SIZE,
          font: textFont,
          color: rgb(0.7, 0.7, 0.7),
        });
      }
    }
  }
}

function drawCalendarGrid(page: PDFPage, calendarData: CalendarData, headerFont: PDFFont, textFont: PDFFont): void {
  const { startX, startY, cellWidth, cellHeight } = computeGridMetrics(calendarData.weeks.length);
  drawHeaderRow(page, startX, startY, cellWidth, cellHeight, headerFont);
  drawCalendarDays(page, calendarData, startX, startY, cellWidth, cellHeight, textFont);
}

export async function generateCalendarPdf(options: PdfGenerationOptions): Promise<Uint8Array> {
  const { year, month } = options;
  const calendarData = generateCalendarData(year, month);

  const pdfDoc = await createPdfDocument();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const fonts = await embedFonts(pdfDoc);

  drawCalendarTitle(page, month, year, fonts.titleFont);
  drawCalendarGrid(page, calendarData, fonts.headerFont, fonts.textFont);

  return pdfDoc.save();
}
