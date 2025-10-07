// components/PdfCanvasViewer.js
import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import { DASHBOARD_CONSTANTS } from "@/utils/constants/dashboard";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfCanvasViewer = ({ url, pageToView }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  console.log(pageToView);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  useEffect(() => {
    if (!containerWidth) return;

    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(pageToView);
        // Use container width minus some padding instead of window width
        const desiredWidth = containerWidth - 48; // 16px padding on each side
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = scaledViewport.width * dpr;
        canvas.height = scaledViewport.height * dpr;
        canvas.style.width = `${scaledViewport.width}px`;
        canvas.style.height = `${scaledViewport.height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport: scaledViewport,
        });

        await renderTaskRef.current.promise;
      } catch (err) {
        if (err?.name !== DASHBOARD_CONSTANTS.RENDERING_CANCELLED_ERROR) {
          console.error(DASHBOARD_CONSTANTS.DOWNLOAD_ERROR, err);
        }
      }
    };

    renderPdf();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [url, containerWidth, pageToView]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          margin: 0,
          padding: 0,
          background: "none",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};

export default PdfCanvasViewer;
