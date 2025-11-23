'use client'

import { Separator } from '@/components/ui/separator'
import { Order } from '@/types/index'
import { format } from 'date-fns'
import React from 'react'

export default function ReportComponent({ data }) {
   const groupedOrders = React.useMemo(() => {
      return data.reduce(
         (acc, order) => {
            // Convert ISO date → YYYY-MM-DD
            const date = new Date(order.createdAt).toISOString().split('T')[0]

            if (!acc[date]) {
               acc[date] = []
            }

            acc[date].push(order)
            return acc
         },
         {} as Record<string, Order[]>
      )
   }, [data])
   console.log('groupedOrders', groupedOrders)

   return (
      <div className="flex-grow overflow-auto">
         {Object.entries(groupedOrders).map(
            ([date, orders]: [string, Order[]]) => (
               <div key={date} className="mb-6">
                  <div className="flex align-center items-center gap-4">
                     <Separator className="w-auto flex-grow" />
                     <h2 className="text-lg opacity-60">
                        {format(new Date(date), 'MMM dd, yyyy')}
                     </h2>
                     <Separator className="w-auto flex-grow" />
                  </div>

                  <div className="space-y-3">
                     {orders.map((order) => (
                        <div key={order.id}>
                           <p>Order #: {order.number}</p>
                           <p>Status: {order.status}</p>
                           <p>Total: ${order.total}</p>

                           <div className="mt-2 pl-4 border-l">
                              {order.orderItems.map((item) => (
                                 <div key={item.productId}>
                                    <p className="font-semibold">
                                       {item.product.title}
                                    </p>
                                    <p>Price: {item.price}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )
         )}
      </div>
   )
}
