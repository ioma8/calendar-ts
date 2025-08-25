import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { generateCalendarData, type CalendarData } from './calendar';
import { CZECH_DAYNAMES, CZECH_MONTHS } from './calendar';
import fs from 'fs/promises';
import path from 'path';

async function loadFont(fontPath: string): Promise<Uint8Array> {
  const fullPath = path.join(process.cwd(), 'public', 'fonts', fontPath);
  console.log('Loading font from:', fullPath);
  const fontBuffer = await fs.readFile(fullPath);
  console.log('Font loaded, size:', fontBuffer.length);
  return new Uint8Array(fontBuffer);
}

export interface PdfGenerationOptions {
  year: number;
  month: number;
}

export async function generateCalendarPdf(options: PdfGenerationOptions): Promise<Uint8Array> {
  const { year, month } = options;
  const calendarData = generateCalendarData(year, month);
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Register fontkit for custom font support using dynamic import
  const fontkit = await import('fontkit');
  pdfDoc.registerFontkit(fontkit);
  
  // Add a page with A4 landscape dimensions
  const page = pdfDoc.addPage([842, 595]); // A4 landscape: 842x595 points
  
  // Load and embed Unicode-compatible fonts
  const regularFontBytes = await loadFont('static/OpenSans-Regular.ttf');
  const boldFontBytes = await loadFont('static/OpenSans-Bold.ttf');
  
  const titleFont = await pdfDoc.embedFont(boldFontBytes);
  const headerFont = await pdfDoc.embedFont(boldFontBytes);
  const textFont = await pdfDoc.embedFont(regularFontBytes);
  
  // Modern color palette
  const primaryColor = rgb(0.15, 0.35, 0.65); // Deep blue
  const headerColor = rgb(0.95, 0.97, 1); // Very light blue
  const weekendColor = rgb(0.98, 0.98, 1); // Subtle weekend tint
  const borderColor = rgb(0.3, 0.3, 0.3); // Darker gray borders for better visibility
  const lightBorderColor = rgb(0.5, 0.5, 0.5); // Medium gray borders for cells
  
  // Draw modern title - centered with full Czech characters
  const monthName = CZECH_MONTHS[month - 1];
  const title = `${monthName} ${year}`;
  const titleWidth = titleFont.widthOfTextAtSize(title, 28);
  page.drawText(title, {
    x: (842 - titleWidth) / 2, // Center horizontally
    y: 545,
    size: 28,
    font: titleFont,
    color: primaryColor,
  });
  
  // Add subtle line under title
  page.drawLine({
    start: { x: 70, y: 520 },
    end: { x: 772, y: 520 },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
  });
  
  // Calculate modern grid dimensions with better spacing
  const startX = 70;
  const startY = 480;
  const gridWidth = 702; // 842 - 70 - 70 (more balanced margins)
  const gridHeight = 360; // More compact grid
  const cellWidth = gridWidth / 7;
  const cellHeight = gridHeight / (calendarData.weeks.length + 1); // +1 for header
  
  // Draw modern calendar grid with Unicode fonts
  drawModernCalendarGrid(page, calendarData, startX, startY, cellWidth, cellHeight, headerFont, textFont, {
    primaryColor,
    headerColor,
    weekendColor,
    borderColor,
    lightBorderColor
  });
  
  // Add subtle footer
  const footerText = `Vygenerováno ${new Date().toLocaleDateString('cs-CZ')}`;
  const footerWidth = textFont.widthOfTextAtSize(footerText, 8);
  page.drawText(footerText, {
    x: (842 - footerWidth) / 2,
    y: 30,
    size: 8,
    font: textFont,
    color: rgb(0.6, 0.6, 0.6),
  });
  
  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

interface ColorPalette {
  primaryColor: ReturnType<typeof rgb>;
  headerColor: ReturnType<typeof rgb>;
  weekendColor: ReturnType<typeof rgb>;
  borderColor: ReturnType<typeof rgb>;
  lightBorderColor: ReturnType<typeof rgb>;
}

function drawModernCalendarGrid(
  page: PDFPage, 
  calendarData: CalendarData, 
  startX: number, 
  startY: number, 
  cellWidth: number, 
  cellHeight: number,
  headerFont: PDFFont,
  textFont: PDFFont,
  colors: ColorPalette
): void {
  const { primaryColor, headerColor, weekendColor, borderColor, lightBorderColor } = colors;
  
  // Draw header row with day names - modern style
  for (let col = 0; col < 7; col++) {
    const x = startX + col * cellWidth;
    const y = startY;
    
    // Draw modern header background with rounded appearance
    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      color: headerColor,
    });
    
    // Draw header border with more visibility
    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: cellWidth,
      height: cellHeight,
      borderColor: borderColor,
      borderWidth: 1.2,
    });
    
    // Draw day name - centered and in Czech (now Unicode compatible!)
    const dayName = CZECH_DAYNAMES[col];
    const dayNameWidth = headerFont.widthOfTextAtSize(dayName, 11);
    page.drawText(dayName, {
      x: x + (cellWidth - dayNameWidth) / 2, // Center horizontally
      y: y - cellHeight / 2 - 3,
      size: 11,
      font: headerFont,
      color: primaryColor,
    });
  }
  
  // Draw calendar weeks with modern styling
  for (let weekIndex = 0; weekIndex < calendarData.weeks.length; weekIndex++) {
    const week = calendarData.weeks[weekIndex];
    const weekY = startY - (weekIndex + 1) * cellHeight;
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const day = week.days[dayIndex];
      const x = startX + dayIndex * cellWidth;
      
      // Draw weekend background with subtle tint
      if ((dayIndex === 5 || dayIndex === 6) && day.isCurrentMonth) {
        page.drawRectangle({
          x,
          y: weekY - cellHeight,
          width: cellWidth,
          height: cellHeight,
          color: weekendColor,
        });
      }
      
      // Draw cell border with better visibility
      page.drawRectangle({
        x,
        y: weekY - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: lightBorderColor,
        borderWidth: 0.8,
      });
      
      // Draw day number with modern styling
      if (day.isCurrentMonth) {
        const dayText = day.day.toString();
        const isWeekend = dayIndex === 5 || dayIndex === 6;
        
        page.drawText(dayText, {
          x: x + 8, // Left-aligned with some padding
          y: weekY - 18, // Top-aligned with some padding
          size: 14,
          font: textFont,
          color: isWeekend ? rgb(0.4, 0.4, 0.4) : rgb(0.2, 0.2, 0.2),
        });
      } else if (!day.isPadding) {
        // Previous/next month days in light gray
        const dayText = day.day.toString();
        page.drawText(dayText, {
          x: x + 8,
          y: weekY - 18,
          size: 12,
          font: textFont,
          color: rgb(0.7, 0.7, 0.7),
        });
      }
    }
  }
}
