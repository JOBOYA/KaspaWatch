// TradingViewWidget.tsx
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// Déclaration d'un type global pour étendre l'objet window (si ce n'est pas déjà fait ailleurs dans votre projet)
declare global {
  interface Window {
    TradingView: any; // Utilisez un type plus spécifique si vous connaissez la structure de l'objet TradingView
  }
}

let tvScriptLoadingPromise: Promise<void> | null = null;

const TradingViewWidget: React.FC = () => {
  const onLoadScriptRef = useRef<() => void>();

  useEffect(() => {
    function loadTradingViewScript() {
      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
      return tvScriptLoadingPromise;
    }

    function createWidget() {
      if (document.getElementById('tradingview_aa636') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "MEXC:KASUSDT",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_aa636"
        });
      }
    }

    onLoadScriptRef.current = createWidget;

    loadTradingViewScript().then(() => {
      onLoadScriptRef.current?.();
    });

    return () => {
      onLoadScriptRef.current = undefined;
    };
  }, []);


  
    return (
      // Conteneur centré avec une hauteur et une largeur maximales
      <div className="flex justify-center items-center w-full h-screen">
        {/* Conteneur du widget avec une largeur et une hauteur spécifiques et centré horizontalement et verticalement */}
        <div className="relative w-[900px] h-[500px]">
          {/* Element du widget */}
          <div id='tradingview_aa636' className="w-full h-full" />
          {/* Copyright fixé en bas à l'intérieur du conteneur du widget */}
          <div className="absolute bottom-0 w-full text-center pb-2">
            <Link href="https://www.tradingview.com/" rel="noopener noreferrer" target="_blank">
              <span className="text-blue-600">Track all markets on TradingView</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default TradingViewWidget;
  