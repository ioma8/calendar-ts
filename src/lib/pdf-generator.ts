import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { generateCalendarData, type CalendarData } from './calendar';
import { CZECH_DAYNAMES_ASCII, CZECH_MONTHS_ASCII } from './fonts';

export interface PdfGenerationOptions {
  year: number;
  month: number;
}

export async function generateCalendarPdf(options: PdfGenerationOptions): Promise<Uint8Array> {
  const { year, month } = options;
  const calendarData = generateCalendarData(year, month);
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page with A4 landscape dimensions
  const page = pdfDoc.addPage([842, 595]); // A4 landscape: 842x595 points
  
  // Get fonts
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Draw title
  const monthName = CZECH_MONTHS_ASCII[month - 1];
  const title = `${monthName} ${year}`;
  page.drawText(title, {
    x: 50,
    y: 550,
    size: 24,
    font: titleFont,
    color: rgb(0, 0, 0),
  });
  
  // Calculate grid dimensions
  const startX = 50;
  const startY = 480;
  const gridWidth = 742; // 842 - 50 - 50
  const gridHeight = 400; // Enough space for calendar
  const cellWidth = gridWidth / 7;
  const cellHeight = gridHeight / (calendarData.weeks.length + 1); // +1 for header
  
  // Draw calendar grid
  drawCalendarGrid(page, calendarData, startX, startY, cellWidth, cellHeight, textFont);
  
  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function drawCalendarGrid(
  page: PDFPage, 
  calendarData: CalendarData, 
  startX: number, 
  startY: number, 
  cellWidth: number, 
  cellHeight: number,
  font: PDFFont
): void {
  const lineColor = rgb(0, 0, 0);
  const headerColor = rgb(0.9, 0.9, 0.9);
  const weekendColor = rgb(0.95, 0.95, 0.95);
  
  // Draw header row with day names
  for (let col = 0; col < 7; col++) {
    const x = startX + col * cellWidth;
    const y = startY;
    
    // Draw header background
    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      color: headerColor,
    });
    
    // Draw header border
    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      borderColor: lineColor,
      borderWidth: 1,
    });
    
    // Draw day name
    page.drawText(CZECH_DAYNAMES_ASCII[col], {
      x: x + 5,
      y: y - cellHeight / 2 - 4,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  }
  
  // Draw calendar weeks
  for (let weekIndex = 0; weekIndex < calendarData.weeks.length; weekIndex++) {
    const week = calendarData.weeks[weekIndex];
    const weekY = startY - (weekIndex + 1) * cellHeight;
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = week.days[dayIndex];
      const x = startX + dayIndex * cellWidth;
      
      // Draw weekend background
      if ((dayIndex === 5 || dayIndex === 6) && !day.isPadding) {
        page.drawRectangle({
          x,
          y: weekY - cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: weekendColor,
        });
      }
      
      // Draw cell border
      page.drawRectangle({
        x,
        y: weekY - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: lineColor,
        borderWidth: 1,
      });
      
      // Draw day number (if not padding)
      if (!day.isPadding) {
        page.drawText(day.day.toString(), {
          x: x + 5,
          y: weekY - 20,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }
}
