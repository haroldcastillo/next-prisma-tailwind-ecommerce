import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import React from 'react'

import ChartComponent from './components/chart-component'
import { FilterButton } from './components/filter-button'
import ReportComponent from './components/report-component'
import TopProductsComponent from './components/top-products-component'

export default async function page({ searchParams }) {
   const { startDate, endDate, categories, brand, page } = searchParams ?? null

   const brandList = await prisma.brand.findMany({
      include: {
         products: true,
      },
   })

   const categoriesLists = await prisma.category.findMany({
      include: {
         products: true,
      },
   })

   const categoryListQuery = categories ? categories.split('+') : []
   const categoryFilter =
      categoryListQuery.length > 0
         ? {
              orderItems: {
                 some: {
                    product: {
                       categories: {
                          some: {
                             OR: categoryListQuery.map((c) => ({
                                title: {
                                   contains: c,
                                   mode: 'insensitive' as const,
                                },
                             })),
                          },
                       },
                    },
                 },
              },
           }
         : {}

   const orders = await prisma.order.findMany({
      where: {
         AND: [
            // Brand filter
            brand
               ? {
                    orderItems: {
                       some: {
                          product: {
                             brand: { id: brand },
                          },
                       },
                    },
                 }
               : {},

            // Category filter (from products)
            categoryFilter,

            // Date range filter
            {
               createdAt: {
                  gte: startDate ? new Date(startDate) : undefined,
                  lte: endDate ? new Date(endDate) : undefined,
               },
            },
         ],
      },

      include: {
         orderItems: {
            include: {
               product: {
                  include: {
                     categories: true,
                     brand: true,
                  },
               },
            },
         },
      },

      take: 12,
   })

   return (
      <div className="space-y-4 my-6 flex flex-col h-[calc(100vh-96px)]">
         <div className="flex items-center justify-between">
            <Heading
               title={`Reports`}
               description="Manage generated reports for your store"
            />
            <FilterButton
               brands={brandList}
               categories={categoriesLists}
               brand={brand}
               category={categories}
               startDate={startDate}
               endDate={endDate}
            />
         </div>
         <Separator />
         <div className=" flex-1  min-h-4 flex flex-col-reverse md:flex-row gap-4">
            <ReportComponent data={orders} />
            <div className="flex-shrink-0  md:w-[250px]">
               <ChartComponent />
               <TopProductsComponent />
            </div>
         </div>
      </div>
   )
}

function getOrderPagination(page: any) {}
