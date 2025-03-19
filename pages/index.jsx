import { Poppins } from 'next/font/google'
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';
import Link from 'next/link';
import FileManager from '@/components/FileManager';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Home({ }) {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [completedOrders, setCompletedOrders] = useState('0');
  const [unfinishedOrders, setUnfinishedOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then(response => {
        const fetchedOrders = response.data;
        setOrders(fetchedOrders);
  
        const completed = fetchedOrders.filter(order => order.status === "Completed");
        setCompletedOrders(completed);
  
        const unfinished = fetchedOrders.filter(order => order.status !== "Completed" && order.status !== "Delivery" && order.status !== "Finished");
        setUnfinishedOrders(unfinished);
  
        // Calculate total sales based on completed orders
        let total = 0;
        for (const order of completed) {
          total += parseFloat(order.total); 
        }
        if(total){ 
          setTotalSales(total);
        }
  
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []); 
  



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
            <Link href={'/orders?orderstatus=Completed'} className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <span className='text-5xl'>
              {completedOrders.length}
                </span>
              COMPLETED
              </div>
            </Link>
            <Link href={"/orders"} className='flex flex-col items-center justify-center bg-slate-100 w-1/6 py-8 rounded-md shadow-md'>
              <div className='text-xl justify-center flex flex-col items-center gap-3'>
                <span className='text-5xl'>
              {unfinishedOrders.length}
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
          <hr className='mt-10 mb-5'/>
          <div className='px-3 py-1 text-center mx-10'>
            <div className='mb-5'>              
              <Link href="https://eu-north-1.console.aws.amazon.com/s3/buckets/neocreative?region=eu-north-1&bucketType=general&tab=objects" className=' px-3 py-1 bg-slate-800 text-slate-100 rounded shadow-lg mt-10'>
                UPLOAD IMAGES
              </Link>
              <div className='mt-5 flex gap-10'>
                <div>Email: developers.neo2024@gmail.com</div>
                <div>Password: aws@neo44</div>
              </div>
            </div>
            <FileManager/>
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
