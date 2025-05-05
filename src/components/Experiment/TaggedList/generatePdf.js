import jsPDF from "jspdf";
import { amiriFont } from "./fonts";
import { getBookName } from '../../../bibles/CUV';

const PT2PX = 0.5; // Conversion factor from points to pixels

export function generatePdf(items) {
  const doc = new jsPDF('l', 'mm', [297, 210]);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = .90;
  const tagFontSize = 24;
  const scriptureFontSize = 26;
  const textFontSize = 48;
  doc.setFontSize(tagFontSize);
  doc.setTextColor(0, 0, 0);
  let yOffset = margin;

  doc.addFileToVFS("Amiri-Regular.ttf", amiriFont);
  doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  doc.setFont("Amiri");

  const drawFrame = () => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(1, 1, pageWidth - 2, pageHeight - 2);  
    doc.setLineWidth(5);
    doc.setDrawColor(127, 127, 127);
    doc.line(margin/2, margin/2, margin/2, pageHeight - margin/2);  
    doc.line(pageWidth - margin/2, margin/2, pageWidth - margin/2, pageHeight - margin/2);  
    doc.setDrawColor(0, 0, 0);
  };
  let textAdded = false;
  const increaseY = () => yOffset += lineHeight * doc.getFontSize() * PT2PX;
  const addText = (text, leftMargin=-1, CR = true) => {
    const yOffsetBackup = yOffset
    let splitText = doc.splitTextToSize(text, leftMargin === -1 ? pageWidth - 2*margin : pageWidth - leftMargin - margin);

    splitText.forEach((line) => {
      const lineWidth = doc.getStringUnitWidth(line) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const lineX = leftMargin === -1 ? (pageWidth - lineWidth) / 2 : leftMargin;
      doc.text(line, lineX, yOffset);
      increaseY()
    });
    textAdded = true;
    if (!CR) {
      yOffset = yOffsetBackup;
    }
  };

  items.forEach((item, index) => {
    if (index > 0 && textAdded) {
      doc.addPage();
      yOffset = margin;
    }
    drawFrame();
    if (item.tag !== '-') {
      doc.setFontSize(tagFontSize);
      addText(`[${item.tag}]`);
      increaseY()
    }
    doc.setFontSize(scriptureFontSize);
    //doc.setFont("Amiri", "bold");
    const parts = item.scripture.split('.')
    const bookName = getBookName(parts[0]);
    addText(`${bookName} ${parts[1]}`);
    increaseY()

    const verseNumDimensions = doc.getTextDimensions('8888');
    const verseNumWidth = verseNumDimensions.w;

    const getVersesHight = () => {
      const textLines = item.verses.reduce((acc, verse) => {
        const verseText = verse.fragments
          .filter((fragment) => !!fragment.text)
          .map(fragment => fragment.text)
          .join(' ');
        const splitLine = doc.splitTextToSize(verseText, pageWidth - margin * 2 - verseNumWidth);
        return acc.concat(splitLine);
      }, []);
      let textDimensions = doc.getTextDimensions(textLines);
      return textDimensions.h;
    }

    let currFontSize = textFontSize;
    doc.setFontSize(currFontSize);

    while(getVersesHight() > pageHeight - yOffset - margin && currFontSize > 0) {
      currFontSize -= 0.5;
      doc.setFontSize(currFontSize);
    }

    doc.setFont("Amiri", "normal");
    item.verses.forEach((verse, verseIndex) => {
      const verseText = verse.fragments
        .filter((fragment) => !!fragment.text)
        .map(fragment => fragment.text)
        .join(' ');

        doc.setFont("Amiri", "bold");
        const thisVerseNumDimensions = doc.getTextDimensions(verse.verse ?? '-');
        const numMargin = margin + .75 * verseNumWidth - thisVerseNumDimensions.w;
        addText(verse.verse ?? '-', numMargin, false);
        doc.setFont("Amiri", "normal");
        addText(verseText, margin + verseNumWidth);
      });

    yOffset += margin; // Add extra space between items
  });

  // Save the PDF
  doc.save('tagged_list.pdf');
}