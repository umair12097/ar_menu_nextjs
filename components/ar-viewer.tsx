"use client";

import { useEffect, useRef } from "react";

interface ModelViewerProps {
  src: string;
  poster?: string;
  alt: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-scale"?: string;
          "ar-placement"?: string;
          "xr-environment"?: boolean;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          exposure?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export default function ARViewer({ src, poster, alt }: ModelViewerProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (document.querySelector('script[data-mv]')) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
    script.dataset.mv = "1";
    document.head.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  return (
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      ar
      ar-modes="scene-viewer webxr quick-look"
      ar-scale="auto"
      ar-placement="floor"
      xr-environment
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {/* AR button — model-viewer only shows this on AR-capable devices (mobile) */}
      <button
        slot="ar-button"
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          color: "#fff",
          border: "none",
          borderRadius: "999px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(109,40,217,0.45)",
          whiteSpace: "nowrap",
        }}
      >
        📱 Place on Your Table
      </button>

      {/* Always-visible badge for non-AR devices (desktop/laptop) */}
      <div
        slot="poster"
        style={{ display: "none" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          backdropFilter: "blur(8px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        📱 Open on your phone to place on your table
      </div>
    </model-viewer>
  );
}
