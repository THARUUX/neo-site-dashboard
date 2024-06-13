import { Poppins } from 'next/font/google'
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
import Link from 'next/link';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Home({ finishedOrders }) {
  const [orders, setOrders] = useState([]);
  const [ordersFinished, setOrdersFinished] = useState([]);
  const [sale, setSale] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  const unfinished = orders.length - finishedOrders.length;

  let totalSales = 0;
  for (const order of finishedOrders) {
    totalSales += parseFloat(order.total);
  }




  const {data:session} = useSession();
    return (
    <Layout>
      <div className="text-lime-500 flex justify-between h-10 p-2 items-center mt-2 pl-5">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-lime-100 h-10 gap-2 text-black rounded-full">
          <img src={session?.user?.image} alt="" className="rounded-full"/>
          <span className="px-2 flex items-center justify-center text-center w-full">
            {session?.user?.name}
          </span>
        </div>
    </div>
        <div className='w-full p-10 '>
          <div className='flex justify-between'>
            <Link href={"/orders"} className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <span className='text-5xl'>
              {orders.length}
                </span>
              ORDERS
              </div>
            </Link>
            <Link href={'/Orders/finished'} className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <span className='text-5xl'>
              {finishedOrders.length}
                </span>
              FINISHED
              </div>
            </Link>
            <Link href={"/orders"} className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <span className='text-5xl'>
              {unfinished}
                </span>
              UNFINISHED
              </div>
            </Link>
            <div className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <div className='text-2xl'>
                  Rs.
                </div>
                <div className='text-5xl'>
                {totalSales}
                </div>
              SALE
              </div>
            </div>
          </div>
          <div className='px-3 py-1 text-center mt-10'>
            <Link href="https://drive.google.com/drive/folders/12tN7pk9W0oWW2VsBRc2GYwuJ5CBb2TBC?usp=drive_link" className='px-3 py-1 bg-slate-800 text-slate-100 rounded shadow-lg mt-10'>
              UPLOAD IMAGES
            </Link>
          </div>
        </div>
    </Layout>
    )
  }


  export async function getServerSideProps() {
    let finishedOrders = [];
    let finished = "finished";

    try {
      await mongooseConnect();
      finishedOrders = await Order.find({status: finished });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
    }
  
    return {
      props: {
        finishedOrders: JSON.parse(JSON.stringify(finishedOrders)),
      },
    };
  }
