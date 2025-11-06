import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use unpkg CDN with specific version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string | File;
  pageNumber?: number;
  onDocumentLoadSuccess?: (numPages: number) => void;
  onPageClick?: (event: React.MouseEvent, pageNumber: number) => void;
  zoom?: number;
  children?: React.ReactNode;
}

export default function PDFViewer({
  fileUrl,
  pageNumber = 1,
  onDocumentLoadSuccess,
  onPageClick,
  zoom = 1,
  children
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    if (onDocumentLoadSuccess) {
      onDocumentLoadSuccess(numPages);
    }
  };

  const onLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please check the file.');
    setLoading(false);
  };

  const onPageLoadSuccess = (page: any) => {
    const viewport = page.getViewport({ scale: zoom });
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);
  };

  const handlePageClick = (event: React.MouseEvent) => {
    if (onPageClick && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      console.log(`Clicked at: ${x.toFixed(2)}%, ${y.toFixed(2)}%`);
      onPageClick(event, pageNumber);
    }
  };

  return (
    <div className="pdf-viewer-container">
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading PDF...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative inline-block"
        onClick={handlePageClick}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={zoom}
            onLoadSuccess={onPageLoadSuccess}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>

        {/* Overlay for custom interactions (regions, etc.) */}
        {children}
      </div>

      {numPages > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Page {pageNumber} of {numPages}
          {pageWidth > 0 && (
            <span className="ml-4">
              Dimensions: {Math.round(pageWidth)} x {Math.round(pageHeight)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
