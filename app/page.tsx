'use client'

import DataTable from "@/components/DataTable"

import Card from "@/components/Chart"
import Head from 'next/head'



export default function Home() {
 
  return (
      <>
      <Head>
  <title>Kaspa Watch - Real-Time Kaspa Blockchain Monitoring</title>
  <meta name="description" content="Explore the latest statistics and trends on the Kaspa blockchain. Track Kaspa prices, volumes, transactions, and more in real-time." />
  <meta name="keywords" content="Kaspa, Kaspa blockchain, Kaspa price, cryptocurrencies, crypto tracking, Kaspa wallets, Kaspa rich list" />
  
</Head>

          <div className=" grid-background">
              <DataTable />
              
             
             
          
          <h1 className="text-3xl font-bold text-center mt-12">Trading Volume</h1>
          <div className="flex justify-center items-center my-4 ">
                
          <Card />
            </div>
          </div>
      </>
  );
}
