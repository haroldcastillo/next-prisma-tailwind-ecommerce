import { Order, ProductInfo } from '@/types/index'
import '@/types/index'
import React from 'react'

export default function TopProductsComponent() {
   return <div>top-products-component</div>
}

export function getTopProductsFromOrders(orders: Order[], limit: number = 5) {
   const productMap: Record<string, ProductInfo> = {}

   for (const order of orders) {
      const seenInThisOrder = new Set<string>()

      for (const item of order.orderItems) {
         const prodId = item.product.id
         if (!productMap[prodId]) {
            productMap[prodId] = {
               id: prodId,
               title: item.product.title,
               totalQuantity: 0,
               orderCount: 0,
            }
         }

         // Add quantity
         productMap[prodId].totalQuantity += item.count

         // Count unique product per order
         if (!seenInThisOrder.has(prodId)) {
            productMap[prodId].orderCount++
            seenInThisOrder.add(prodId)
         }
      }
   }

   // Convert object → array, sort, and slice top N
   return Object.values(productMap)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit)
}
