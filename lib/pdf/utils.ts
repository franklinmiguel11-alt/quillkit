import { PDFDocument } from 'pdf-lib'

export async function getPdfPageCount(fileBuffer: ArrayBuffer): Promise<number> {
    const pdfDoc = await PDFDocument.load(fileBuffer)
    return pdfDoc.getPageCount()
}
