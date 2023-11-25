import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
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
  const [showBlur, setShowBlur] = useState(false); // État pour le flou
  const blurRef = useRef<HTMLDivElement | null>(null);

  const [showAddress, setShowAddress] = useState(false);
  const yourKaspaAddress = "kaspa:qypymssp9zdfk84r9wwchpj35525xc7eczlpvqry439350qclvu22hca0jean82";

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

  const priceClass = marketData && marketData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';

  const formatPriceChange = (priceChange: number) => {
    const priceChangeClass = priceChange >= 0 ? 'text-green-500' : 'text-red-500';
    return (
      <span className={priceChangeClass}>
        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
      </span>
    );
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (blurRef.current && !blurRef.current.contains(target)) {
        setShowBlur(false);
        setShowAddress(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress);
    setShowBlur(!showBlur);
  };

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
      {showBlur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" />
      )}

      <button
        className="absolute right-0 top-0 mr-4 mt-4 flex items-center text-white"
        onClick={toggleAddressVisibility}
      >
        <FaHeart className="text-red-500 mr-2" />
        Donate
      </button>

      {showAddress && (
        <div ref={blurRef} className="absolute right-0 top-12 mt-4 mr-4 p-2 rounded shadow-lg z-30 bg-opacity-75 bg-green-300 text-center text-white text-sm sm:text-base break-words" style={{ wordBreak: 'break-all' }}>
          {yourKaspaAddress}
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
          <div className="relative w-24 h-24 md:w-28 md:h-28">
            <Image
              src="/OIP-removebg-preview.svg"
              alt="Kaspa Logo"
              layout="fill"
              objectFit="contain"
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
              <h2 className="text-xl font-bold mb-2 sm:mb-4">KAS Market Data</h2>
              <p>Rank: {marketData.rank}</p>
              <p>Price: <span className={priceClass}>${marketData.price.toFixed(4)}</span></p>
              <p>24h Change: {formatPriceChange(marketData.priceChange24h)}</p>
              <p>24h Volume: ${marketData.volume24h.toLocaleString()}</p>
              <p className='text-sm'>Market Cap: ${marketData.marketCap.toLocaleString()}</p>
            </>
          ) : (
            <p>Error loading data...</p>
          )}
        </div>
        </div>
      
    </>
  );
};

export default KasPriceCard;
