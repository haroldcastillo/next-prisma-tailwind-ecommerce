'use client'

// components
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { useUpdateQueryParam } from '@/hooks/useUpdateQueryParam'
import { set } from 'date-fns'
// utils
import { useFormik } from 'formik'
import { Sliders } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
   BrandCombobox,
   CategoriesCombobox,
   PriceRange,
   SortBy,
} from './options'

export function FilterButton({
   sort,
   brand,
   category,
   categories,
   brands,
   minPrice,
   maxPrice,
}) {
   const [open, setOpen] = useState(false)
   const [filterCount, setFilterCount] = useState(0)
   const { updateMany } = useUpdateQueryParam()

   const formik = useFormik({
      initialValues: {
         sort: sort || '',
         brand: brand || '',
         categories: category || '',
         minPrice: minPrice || '',
         maxPrice: maxPrice || '',
      },
      validate: (values) => {
         const errors: Record<string, string> = {}
         const min = parseFloat(values.minPrice)
         const max = parseFloat(values.maxPrice)
         if (values.minPrice && isNaN(min)) {
            errors.minPrice = 'Minimum price must be a valid number'
         }
         if (values.maxPrice && isNaN(max)) {
            errors.maxPrice = 'Maximum price must be a valid number'
         }
         if (!errors.minPrice && !errors.maxPrice) {
            if (!isNaN(min) && !isNaN(max) && min > max) {
               errors.minPrice =
                  'Minimum price cannot be greater than maximum price'
            }
         }
         return errors
      },
      onSubmit: (values) => {
         updateMany({
            sort: values.sort,
            brand: values.brand,
            category: values.categories,
            minPrice: values.minPrice,
            maxPrice: values.maxPrice,
         })
         toast.success('Filters applied successfully')
         setOpen(false)
      },
   })
   useEffect(() => {
      let count = 0
      if (formik.values.sort) count++
      if (formik.values.brand) count++
      if (formik.values.categories) {
         formik.values.categories.split('+').forEach(() => {
            count++
         })
      }
      if (formik.values.minPrice) count++
      if (formik.values.maxPrice) count++

      setFilterCount(count)
   }, [
      formik.values.sort,
      formik.values.brand,
      formik.values.categories,
      formik.values.minPrice,
      formik.values.maxPrice,
   ])

   return (
      <Popover
         open={open}
         onOpenChange={() => {
            setOpen(!open)
            formik.setValues({
               sort: sort || '',
               brand: brand || '',
               categories: category || '',
               minPrice: minPrice || '',
               maxPrice: maxPrice || '',
            })
         }}
      >
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="w-full md:w-auto flex items-center gap-2"
            >
               <Sliders className="h-4 w-4" />

               {/* Label + badge wrapper */}
               <div className="relative flex items-center">
                  <span>Filter</span>
                  {filterCount > 0 && (
                     <span
                        className="absolute -top-1 -right-3 flex h-3 w-3 items-center justify-center
        rounded-full bg-primary text-[6px] font-bold text-primary-foreground"
                     >
                        {filterCount}
                     </span>
                  )}
               </div>
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className="w-[300px] max-w-md p-4"
            side="bottom"
            align="end"
         >
            <div className="grid gap-4">
               <div className="grid gap-2">
                  <Label className="pb-2">Sort By</Label>
                  <SortBy
                     value={formik.values.sort}
                     onChange={(value) => {
                        if (value !== formik.values.sort) {
                           formik.setFieldValue('sort', value)
                        } else {
                           formik.setFieldValue('sort', '')
                        }
                     }}
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Category</Label>
                  <CategoriesCombobox
                     categories={categories}
                     initialCategory={formik.values.categories}
                     onChange={(value) =>
                        formik.setFieldValue('categories', value)
                     }
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Price Range</Label>
                  <PriceRange
                     minValue={formik.values.minPrice}
                     maxValue={formik.values.maxPrice}
                     minOnChange={(value) =>
                        formik.setFieldValue('minPrice', value)
                     }
                     maxOnChange={(value) =>
                        formik.setFieldValue('maxPrice', value)
                     }
                     isError={
                        formik.touched.minPrice || formik.touched.maxPrice
                           ? !!(
                                formik.errors.minPrice || formik.errors.maxPrice
                             )
                           : false
                     }
                     errorMessage={
                        formik.errors.minPrice || formik.errors.maxPrice || ''
                     }
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Brand</Label>
                  <BrandCombobox
                     brands={brands}
                     value={formik.values.brand}
                     onChange={(value) => formik.setFieldValue('brand', value)}
                  />
               </div>

               <Button
                  type="submit"
                  onClick={() => {
                     formik.handleSubmit()
                  }}
               >
                  Apply Filters
               </Button>
               <Button
                  variant="ghost"
                  onClick={() => {
                     formik.resetForm()
                     updateMany({
                        sort: '',
                        brand: '',
                        category: '',
                        minPrice: '',
                        maxPrice: '',
                     })
                     setFilterCount(0)
                     toast.success('Filters cleared successfully')
                     setOpen(false)
                  }}
               >
                  Clear Filters
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
