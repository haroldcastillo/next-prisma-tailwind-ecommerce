'use client'

// utils
// Components
import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDebounce } from '@/hooks/useDebounce'
import { useUpdateQueryParam } from '@/hooks/useUpdateQueryParam'
// utils
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { max } from 'date-fns'
// Icons
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

type SortByProps = {
   value?: string
   onChange?: (value: string) => void
}

export function SortBy({ value, onChange }: SortByProps) {
   const [open, setOpen] = React.useState(false)
   const valueMap: Record<string, string> = {
      most_expensive: 'Most Expensive',
      least_expensive: 'Least Expensive',
      title_asc: 'Title Ascending',
      title_desc: 'Title Descending',
   }
   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full flex justify-between overflow-hidden "
            >
               <span className="max-w-[400px] truncate">
                  {value ? valueMap[value] : 'Sort by...'}
               </span>
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0 ">
            <Command>
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  {Object.entries(valueMap).map(([key, label]) => {
                     const isSelected = value === key
                     return (
                        <CommandItem
                           key={key}
                           value={key}
                           onSelect={() => {
                              onChange?.(key)
                              setOpen(false)
                           }}
                           className={`flex align-start content-start hover:opacity-100 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4 w-4',
                                 isSelected ? 'opacity-100' : 'opacity-0'
                              )}
                           />
                           {label}
                        </CommandItem>
                     )
                  })}
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function PriceRange({
   minValue,
   maxValue,
   minOnChange,
   maxOnChange,
   isError,
   errorMessage,
}: {
   minValue?: string
   maxValue?: string
   minOnChange?: (value: string) => void
   maxOnChange?: (value: string) => void
   isError?: boolean
   errorMessage?: any
}) {
   return (
      <div>
         <div className="flex items-center gap-1">
            <Input
               type="number"
               placeholder="Min"
               defaultValue={isVariableValid(minValue) ? minValue : ''}
               className={cn('w-full', isError ? 'border-red-500' : '')}
               min={0}
               onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                     e.preventDefault()
                  }
               }}
               max={maxValue ? parseFloat(maxValue) : 1000000}
               onChange={(e) => minOnChange?.(e.target.value)}
            />
            -
            <Input
               type="number"
               placeholder="Max"
               defaultValue={isVariableValid(maxValue) ? maxValue : ''}
               className="w-full"
               min={minValue}
               onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                     e.preventDefault()
                  }
               }}
               max={1000000}
               onChange={(e) => maxOnChange?.(e.target.value)}
            />
         </div>
         {isError && (
            <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
         )}
      </div>
   )
}

export function CategoriesCombobox({ categories, initialCategory, onChange }) {
   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState<string[]>([])

   function getCategoryTitle() {
      const selectedCategories = categories.filter((category) =>
         value.includes(slugify(category.title))
      )
      return selectedCategories.map((cat) => cat.title).join(', ')
   }

   function toggleListItem(slug: string) {
      let updatedList = [...value]
      if (updatedList.includes(slug)) {
         updatedList = updatedList.filter((item) => item !== slug)
      } else {
         updatedList.push(slug)
      }
      setValue(updatedList)

      onChange?.(updatedList.join('+'))
   }

   useEffect(() => {
      // check if initialCategory is defined
      if (!initialCategory) return

      const initialSlugs = initialCategory
         .split('+')
         .map((title) => slugify(title))

      setValue(initialSlugs)
   }, [initialCategory])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full flex justify-between overflow-hidden "
            >
               <span className="max-w-[400px] truncate">
                  {value.length > 0 ? getCategoryTitle() : 'Select category...'}
               </span>
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0 ">
            <Command>
               <CommandInput placeholder="Search category..." />
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  {categories.map((category) => {
                     const slug = slugify(category.title)
                     const isSelected = value.includes(slug)
                     return (
                        <CommandItem
                           key={category.title}
                           value={category.title}
                           onSelect={() => {
                              toggleListItem(slug)
                           }}
                           className={`flex align-start content-start hover:opacity-100 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4 w-4',
                                 isSelected ? 'opacity-100' : 'opacity-0'
                              )}
                           />
                           {category.title}
                        </CommandItem>
                     )
                  })}
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, value, onChange }) {
   const [open, setOpen] = React.useState(false)

   function getBrandTitle() {
      for (const brand of brands) {
         if (brand.id === value) return brand.title
      }
   }

   return (
      <>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
               >
                  {value ? getBrandTitle() : 'Select brand...'}
                  <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
               <Command>
                  <CommandInput placeholder="Search brand..." />
                  <CommandList>
                     <CommandEmpty>No brand found.</CommandEmpty>

                     <CommandGroup>
                        {brands.map((brand) => {
                           const isSelected = value === brand.id
                           return (
                              <CommandItem
                                 key={brand.title}
                                 value={brand.title}
                                 onSelect={() => {
                                    onChange?.(brand.id)
                                    setOpen(false)
                                 }}
                                 className={`flex align-start content-start hover:opacity-100 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                              >
                                 <Check
                                    className={cn(
                                       'mr-2 h-4',
                                       isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                 />
                                 {brand.title}
                              </CommandItem>
                           )
                        })}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </>
   )
}

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = React.useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   return (
      <div className="flex w-full border rounded-md items-center space-x-2">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={(currentValue: boolean) => {
                  const current = new URLSearchParams(
                     Array.from(searchParams.entries())
                  )

                  current.set(
                     'isAvailable',
                     currentValue == true ? 'true' : 'false'
                  )
                  setValue(currentValue)

                  // cast to string
                  const search = current.toString()
                  // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                  const query = search ? `?${search}` : ''

                  router.replace(`${pathname}${query}`, {
                     scroll: false,
                  })
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}

export function SearchInput({
   initialData,
   className,
   ...props
}: {
   initialData?: string
   className?: string
   [key: string]: any
}) {
   const { updateQuery } = useUpdateQueryParam()

   const [value, setValue] = React.useState(initialData || '')
   const debouncedValue = useDebounce(value, 500)

   // Update search param when debounced value changes
   useEffect(() => {
      updateQuery('search', debouncedValue)
   }, [debouncedValue])

   return (
      <Input
         type="text"
         placeholder="Search products..."
         className={cn('w-full', className)}
         value={value}
         onChange={(e) => setValue(e.target.value)}
         {...props}
      />
   )
}
