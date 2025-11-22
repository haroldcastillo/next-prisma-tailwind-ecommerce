import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import { FilterButton } from './components/filter-button'
import { SearchInput } from './components/options'

export default async function Products({ searchParams }) {
   const {
      sort,
      isAvailable,
      brand,
      category,
      page = 1,
      search,
      minPrice,
      maxPrice,
   } = searchParams ?? null

   const orderBy = getOrderBy(sort)

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()

   const categoryList = category ? category.split('+').filter(Boolean) : null
   const products = await prisma.product.findMany({
      where: {
         title: {
            contains: search,
            mode: 'insensitive',
         },
         isAvailable: isAvailable == 'true' || sort ? true : undefined,
         brand: {
            id: brand || undefined,
         },
         price: {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
         },
         categories: categoryList
            ? {
                 some: {
                    OR: categoryList.map((c) => ({
                       title: {
                          contains: c,
                          mode: 'insensitive',
                       },
                    })),
                 },
              }
            : undefined,
      },
      orderBy,
      skip: (page - 1) * 12,
      take: 12,
      include: {
         brand: true,
         categories: true,
      },
   })

   return (
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
            specialDiv={
               <div className="flex gap-3">
                  <SearchInput initialData={searchParams?.search || ''} />
                  <FilterButton
                     brands={brands}
                     categories={categories}
                     sort={sort}
                     brand={brand}
                     category={category}
                     minPrice={minPrice}
                     maxPrice={maxPrice}
                  />
               </div>
            }
         />

         <Separator />
         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break

      case 'title_asc':
         orderBy = {
            title: 'asc',
         }
         break

      case 'title_desc':
         orderBy = {
            title: 'desc',
         }
         break
      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
