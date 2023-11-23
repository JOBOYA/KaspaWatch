import React, { useState, useEffect, useRef } from 'react';

interface MarketData {
  rank: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;

}

const KasPriceCard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-v2-do.kas.fyi/market');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MarketData = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error("Could not fetch market data: ", error);
      }
    };

    fetchData();
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
    <div className="flex justify-center">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="mt-10 w-[500px] h-64 flex flex-col items-center justify-between p-5 rounded-lg backdrop-blur-sm bg-opacity-30 bg-black border border-gray-700 cursor-pointer relative overflow-hidden"
      >
        <div
          className="hover-circle absolute w-32 h-32 rounded-full transition-all duration-500"
          style={{
            background: 'radial-gradient(circle at center, rgba(5, 150, 105, 0.4) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            left: 'var(--x)',
            top: 'var(--y)',
            opacity: '0', // initially invisible
          }}
        ></div>
      <h2 className="text-xl font-bold mb-4">KAS Market Data</h2>
      {marketData ? (
        <div>
          <p>Rank: {marketData.rank}</p>
          <p>Price: ${marketData.price.toFixed(4)}</p>
          <p>24h Change: {marketData.priceChange24h.toFixed(2)}%</p>
          <p>24h Volume: {marketData.volume24h.toLocaleString()} KAS</p>
          <p>Market Cap: ${marketData.marketCap.toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading market data...</p>
      )}
    </div>
        </div>
    
  );
};

export default KasPriceCard;
