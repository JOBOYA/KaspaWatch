import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image'
import { FaHeart } from 'react-icons/fa';

interface MarketData {
  rank: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;

}

const KasPriceCard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const [showAddress, setShowAddress] = useState(false); // State to toggle address visibility
  const yourKaspaAddress = "kaspa:qypymssp9zdfk84r9wwchpj35525xc7eczlpvqry439350qclvu22hca0jean82"; 

  // Fonction pour récupérer les données du marché
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-v2-do.kas.fyi/market');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MarketData = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error("Could not fetch market data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Détermine la classe de couleur en fonction de la variation de prix
  const priceClass = marketData && marketData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
  const priceChangeSign = marketData && marketData.priceChange24h >= 0 ? '+' : '';

 // Formatage de la variation de prix avec couleur conditionnelle
 const formatPriceChange = (priceChange: number) => {
  const priceChangeClass = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
  const priceChangeSign = priceChange >= 0 ? '+' : '';
  return (
    <span className={priceChangeClass}>
      {priceChangeSign}{priceChange.toFixed(2)}%
    </span>
  );
};

  useEffect(() => {
    fetchData(); // Appeler fetchData immédiatement lors du montage du composant
    const intervalId = setInterval(fetchData, 60000); // Configurer un intervalle pour actualiser les données toutes les 60 secondes
    return () => clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage du composant
  }, []);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const card = cardRef.current;
      const cardStyle = getComputedStyle(card);
      const cardBorderLeft = parseInt(cardStyle.borderLeftWidth, 10);
      const cardBorderTop = parseInt(cardStyle.borderTopWidth, 10);
      const { left, top } = card.getBoundingClientRect();
      const x = event.clientX - left - cardBorderLeft;
      const y = event.clientY - top - cardBorderTop;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }
  };
  

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const hoverCircle = cardRef.current.querySelector('.hover-circle') as HTMLDivElement;
      hoverCircle.style.opacity = '1';
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const hoverCircle = cardRef.current.querySelector('.hover-circle') as HTMLDivElement;
      hoverCircle.style.opacity = '0';
    }
  };

  return (
    <>
    <button
        className="absolute right-0 top-0 mr-4 mt-4 flex items-center text-white"
        onClick={() => setShowAddress(!showAddress)} // Toggle address visibility on click
      >
        <FaHeart className="text-red-500 mr-2" /> {/* Heart icon */}
        Donate
      </button>

      {showAddress && (
        <div className="absolute right-0 top-0 mt-12 mr-4 p-2  rounded shadow-lg z-10">
          {yourKaspaAddress} {/* This will show your address */}
        </div>
      )}

    <div className="flex justify-center ml-4 mr-4">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="mt-10 w-full max-w-[500px] h-auto flex flex-col items-center justify-between p-5 rounded-lg backdrop-blur-sm bg-opacity-30 bg-black border border-gray-700 relative overflow-hidden space-y-4"
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28"> {/* Taille ajustable pour responsive */}
          <Image
            src="/OIP-removebg-preview.svg"
            alt="Kaspa Logo"
            layout="fill" // Utilisation de "fill" pour un responsive adaptatif
            objectFit="contain" // Garde l'aspect ratio de l'image
          />
        </div>
        <div
          className="hover-circle absolute w-32 h-32 rounded-full transition-all duration-500"
          style={{
            background: 'radial-gradient(circle at center, rgba(5, 150, 105, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            left: 'var(--x)',
            top: 'var(--y)',
            opacity: '0',
          }}
        ></div>

      <div >
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
          </>
        ) : marketData ? (
          <>
            <h2 className="text-xl font-bold mb-4">KAS Market Data</h2>
            <p>Rank: {marketData.rank}</p>
            <p>
              Price: <span className={priceClass}>${marketData.price.toFixed(4)}</span>
            </p>
            <p>24h Change: {formatPriceChange(marketData.priceChange24h)}</p>
            <p>24h Volume: ${marketData.volume24h.toLocaleString()}</p>
            <p>Market Cap: ${marketData.marketCap.toLocaleString()}</p>
          </>
        ) : (
          <p>Error loading data...</p>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default KasPriceCard;
