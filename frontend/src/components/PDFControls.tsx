import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface PDFControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onRotate?: () => void;
}

export default function PDFControls({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange,
  onRotate
}: PDFControlsProps) {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 3) {
      onZoomChange(Math.min(zoom + 0.25, 3));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      onZoomChange(Math.max(zoom - 0.25, 0.5));
    }
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 px-6 py-3 rounded-lg shadow-sm">
      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            max={totalPages}
          />
          <span className="text-gray-600">of {totalPages}</span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <button
          onClick={handleZoomReset}
          className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors min-w-[60px]"
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {onRotate && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button
              onClick={onRotate}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
