import React, { useEffect, useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import PaginationComponent from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import SearchComponent from './Search';
import KasPriceCard from "@/components/KaspaPriceCard"


interface Tag {
  address: string;
  name: string;
  link: string | null;
}

interface Address {
  address: string;
  balance: string;
  percent: number;
  tags: Tag[];
}

const DataTable: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAddresses, setCopiedAddresses] = useState<Record<string, boolean>>({});
  const [kaspaPrice, setKaspaPrice] = useState<number>(0);


  // Fonction pour récupérer le prix du Kaspa
  const fetchKaspaPrice = async () => {
    try {
      const response = await fetch('https://api-v2-do.kas.fyi/market');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKaspaPrice(data.price); // Assurez-vous que 'data.price' correspond à la structure de votre réponse API
    } catch (error) {
      console.error("Could not fetch Kaspa price:", error);
    }
  };

  useEffect(() => {
    

    fetchKaspaPrice(); 
    const intervalId = setInterval(fetchKaspaPrice, 60000); // Actualiser le prix toutes les 60 secondes

    return () => clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage
  }, []);


  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    let intervalId: any
  
    const fetchData = () => {
      setLoading(true);
      fetch(`https://api-v2-do.kas.fyi/analytics/addresses/richList?page=${currentPage}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data: Address[]) => {
          setAddresses(data);
          const filteredData = data.filter((address) => address.address.includes(searchTerm));
          setFilteredAddresses(filteredData);
        })
        .catch((error) => {
          setError('Failed to fetch addresses');
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    fetchData(); // Appeler fetchData immédiatement lors du montage du composant
  
    intervalId = setInterval(fetchData, 60000); // Configurer un intervalle pour actualiser les données toutes les 60 secondes
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage du composant
      }
    };
  }, [currentPage, searchTerm]); // Les dépendances pour réinitialiser l'intervalle lorsque ces valeurs changent
  

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddresses((prev) => ({ ...prev, [text]: true }));
      setTimeout(() => {
        setCopiedAddresses((prev) => ({ ...prev, [text]: false }));
      }, 2000);
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAddresses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const skeletonHeightClass = 'h-6';

  //une fonction pour gérer le clic sur l'adresse
const handleAddressClick = (address:string) => {
  window.open(`https://explorer.kaspa.org/addresses/${address}`, '_blank');
};

  return (
<>
<KasPriceCard/>
<h1 className="text-6xl font-semibold text-center mt-10">Kas Top Address 10k Rich List</h1>

<div className="flex flex-col items-center justify-center mt-16">
      <div className="w-5/6">
        <div className="flex justify-end mb-4">
          <SearchComponent onSearch={handleSearch} />
        </div>
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? [...Array(itemsPerPage)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className={skeletonHeightClass} /></TableCell>
                <TableCell><Skeleton className={skeletonHeightClass} /></TableCell>
                <TableCell><Skeleton className={skeletonHeightClass} /></TableCell>
                <TableCell><Skeleton className={skeletonHeightClass} /></TableCell>
                <TableCell><Skeleton className={skeletonHeightClass} /></TableCell>
              </TableRow>
            )) : currentItems.map((address, index) => (
              <TableRow key={address.address}>
                <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                  <span 
      className="address-link truncate max-w-xs cursor-pointer" 
      onClick={() => handleAddressClick(address.address)}
    >
      {address.address}
    </span>
                    <button onClick={() => copyToClipboard(address.address)}>
                      {copiedAddresses[address.address] ? (
                        <FiCheck className="text-green-500" />
                      ) : (
                        <FiCopy className="text-gray-500 hover:text-gray-700" />
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>{address.tags.map(tag => tag.name).join(', ')}</TableCell>
                <TableCell>
      {(parseInt(address.balance) / 1e8).toFixed(6)} KAS
      <span className="text-slate-400 text-xs bg-slate-600 rounded-md py-1 px-1 ml-2">
        {` $${(parseInt(address.balance) / 1e8 * kaspaPrice).toFixed(2)}`}
      </span>
    </TableCell>
    <TableCell>{address.percent.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && (
          <PaginationComponent
            currentPage={currentPage}
            totalCount={filteredAddresses.length}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    
    </div>
   
      </>
    
  );
};

export default DataTable;