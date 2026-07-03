import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search as SearchIcon, LayoutGrid, List } from 'lucide-react'

type InventoryFiltersProps = {
  itemsPerPage: number
  setItemsPerPage: (val: number) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  riskFilter: string
  setRiskFilter: (val: string) => void
  viewMode: 'list' | 'icons'
  setViewMode: (val: 'list' | 'icons') => void
  categories: any[] | undefined
}

export function InventoryFilters({
  itemsPerPage,
  setItemsPerPage,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  riskFilter,
  setRiskFilter,
  viewMode,
  setViewMode,
  categories,
}: InventoryFiltersProps) {
  return (
    <div className='mt-4 flex flex-wrap items-center gap-3'>
      <Select
        value={String(itemsPerPage)}
        onValueChange={(val) => {
          setItemsPerPage(Number(val))
        }}
      >
        <SelectTrigger className='w-[110px] cursor-pointer'>
          <SelectValue placeholder='Tampilkan' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='10' className='cursor-pointer'>10 Baris</SelectItem>
          <SelectItem value='25' className='cursor-pointer'>25 Baris</SelectItem>
          <SelectItem value='50' className='cursor-pointer'>50 Baris</SelectItem>
          <SelectItem value='100' className='cursor-pointer'>100 Baris</SelectItem>
        </SelectContent>
      </Select>

      <div className='relative flex-1 sm:max-w-xs'>
        <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Cari produk atau SKU...'
          className='pl-9'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className='w-[170px] cursor-pointer'>
          <SelectValue placeholder='Kategori' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all' className='cursor-pointer'>Semua Kategori</SelectItem>
          {categories && categories.map((c: any) => (
            <SelectItem key={c.id} value={c.name} className='cursor-pointer'>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={riskFilter} onValueChange={setRiskFilter}>
        <SelectTrigger className='w-[150px] cursor-pointer'>
          <SelectValue placeholder='Risiko Kadaluarsa' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all' className='cursor-pointer'>Semua Risiko</SelectItem>
          <SelectItem value='High' className='cursor-pointer'>High Risk</SelectItem>
          <SelectItem value='Medium' className='cursor-pointer'>Medium Risk</SelectItem>
          <SelectItem value='Low' className='cursor-pointer'>Low Risk</SelectItem>
        </SelectContent>
      </Select>

      <div className='ms-auto flex items-center gap-1 rounded-md border p-1 bg-background'>
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size='icon'
          className='h-8 w-8 cursor-pointer'
          onClick={() => setViewMode('list')}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          variant={viewMode === 'icons' ? 'secondary' : 'ghost'}
          size='icon'
          className='h-8 w-8 cursor-pointer'
          onClick={() => setViewMode('icons')}
        >
          <LayoutGrid className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
