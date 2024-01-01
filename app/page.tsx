'use client'

import DataTable from "@/components/DataTable";
import Bar from "@/components/BarChart";
import Chart from "@/components/Chart";
import Head from 'next/head';
import { useState } from "react";
import ButtonSecondary from "@/components/Button";

export default function Home() {
  const [showChart, setShowChart] = useState(false);

  return (
    <>
     <Head>
        <title>Kaspa Watch - Real-Time Kaspa Blockchain Monitoring</title>
        <meta name="description" content="Explore the latest statistics and trends on the Kaspa blockchain. Track Kaspa prices, volumes, transactions, and more in real-time." />
        <meta name="keywords" content="Kaspa, Kaspa blockchain, Kaspa price, cryptocurrencies, crypto tracking, Kaspa wallets, Kaspa rich list" />
        <script
          id="seona-js-plugin"
          defer
          src="https://assets.usestyle.ai/seonajsplugin"
          type="text/javascript"
        ></script>
      </Head>

      <div className="grid-background">
        <DataTable />

        {/* Utilisez flex pour mettre en page le titre et le bouton côte à côte avec de l'espace entre eux */}
        <div className="flex flex-col items-center mt-12 space-y-4">
          {/* Titre */}
          <h1 className="text-3xl font-bold">
            {showChart ? 'Chart' : 'Trading Volume'}
          </h1>
          {/* Bouton avec marge sur le dessus */}
          <ButtonSecondary onClick={() => setShowChart(!showChart)}>
            {showChart ? 'Bar Chart' : 'Line Chart'}
          </ButtonSecondary>
        </div>

        {/* Affichage conditionnel de Bar ou Chart en fonction de showChart */}
        <div className="flex justify-center items-center my-4">
          {showChart ? <Chart /> : <Bar />}
        </div>
      </div>
    </>
  );
}
