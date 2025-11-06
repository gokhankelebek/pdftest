import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use local file from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  fileUrl: string | File;
  pageNumber?: number;
  onDocumentLoadSuccess?: (numPages: number) => void;
  onPageClick?: (event: React.MouseEvent, pageNumber: number) => void;
  onPageDimensionsChange?: (width: number, height: number) => void;
  zoom?: number;
  children?: React.ReactNode;
}

export default function PDFViewer({
  fileUrl,
  pageNumber = 1,
  onDocumentLoadSuccess,
  onPageClick,
  onPageDimensionsChange,
  zoom = 1,
  children
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure worker is configured before rendering
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }, []);

  // Note: onPageLoadSuccess will be called when zoom changes, so we don't need
  // a separate useEffect here. This prevents infinite loops.

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
    if (onPageDimensionsChange) {
      onPageDimensionsChange(viewport.width, viewport.height);
    }
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
        style={{ position: 'relative' }}
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
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: pageWidth > 0 ? `${pageWidth}px` : '100%', 
            height: pageHeight > 0 ? `${pageHeight}px` : '100%'
          }}
        >
          {children}
        </div>
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
