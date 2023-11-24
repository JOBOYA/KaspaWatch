'use client'

import DataTable from "@/components/DataTable"

import Card from "@/components/Chart"



export default function Home() {
 
  return (
      <>
          <div className=" grid-background">
              <DataTable />
              
             
             
          
          <h1 className="text-3xl font-bold text-center">Trading Volume</h1>
          <div className="flex justify-center items-center my-4 ">
                
          <Card />
            </div>
          </div>
      </>
  );
}
