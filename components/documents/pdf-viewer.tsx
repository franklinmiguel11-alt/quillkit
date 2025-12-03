"use client"

import { useState } from "react"
import { Document as PDFDocument, Page, pdfjs } from "react-pdf"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewer({ url }: { url: string }) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full overflow-auto max-h-[600px] border rounded-md bg-slate-100 p-4 flex justify-center">
                <PDFDocument
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<Loader2 className="h-8 w-8 animate-spin" />}
                    className="flex flex-col gap-4"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="shadow-md">
                            <Page
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                width={600}
                            />
                        </div>
                    ))}
                </PDFDocument>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
                Showing {numPages} pages
            </div>
        </div>
    )
}
