import { useState } from 'react'
import {
  HelpCircle,
  LayoutDashboard,
  Package,
  Brain,
  BellRing,
  BarChart3,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function HelpCenter() {
  const [activeTab, setActiveTab] = useState('flow')

  const workflowSteps = [
    {
      step: '01',
      title: 'Inventarisasi Stok (Inventory)',
      desc: 'Logistics Manager memasukkan batch produk segar beserta umur simpannya (shelf life).',
      icon: Package,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      step: '02',
      title: 'Analisis Risiko (AI Forecasting)',
      desc: 'AI secara otomatis memprediksi risiko food loss dan kuantitas reorder berdasarkan sisa umur simpan.',
      icon: Brain,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      step: '03',
      title: 'Kampanye Promosi (Digital Nudging)',
      desc: 'Marketing Manager membuat strategi promosi (diskon, bundling, atau badge) untuk mempercepat penjualan.',
      icon: BellRing,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      step: '04',
      title: 'Simulasi Pembelian & FEFO',
      desc: 'Simulasi checkout ritel memotong stok secara FEFO (stok terlama/paling dekat kadaluarsa keluar dulu).',
      icon: Zap,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      step: '05',
      title: 'Evaluasi Kinerja (Analytics)',
      desc: 'Semua penjualan, keberhasilan nudging, dan waste berkurang dipantau langsung via grafik performa.',
      icon: BarChart3,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
  ]

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='text-start'>
        <div className='mb-3'>
          <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
            <HelpCircle className='h-6 w-6 text-emerald-600' />
            Pusat Bantuan (Help Center)
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Pelajari cara kerja sistem logistik pangan segar Freashday, fitur per halaman, dan pembagian hak akses pengguna.
          </p>
        </div>

        {/* Workflow Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full space-y-6'>
          <div className='flex justify-start border-b pb-1'>
            <TabsList className='bg-muted/50 p-1 rounded-lg border'>
              <TabsTrigger value='flow' className='flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm'>
                <Zap className='h-4 w-4' /> Alur Kerja Sistem
              </TabsTrigger>
              <TabsTrigger value='menus' className='flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm'>
                <BookOpen className='h-4 w-4' /> Panduan Fitur Menu
              </TabsTrigger>
              <TabsTrigger value='rbac' className='flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm'>
                <ShieldCheck className='h-4 w-4' /> Peran & Hak Akses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: FLOW INTERAKTIF */}
          <TabsContent value='flow' className='mt-0 space-y-6 animate-in fade-in-50 duration-200'>
            <Card className='border shadow-xs'>
              <CardHeader>
                <CardTitle className='text-base font-bold'>Visualisasi Alur Data Rantai Pasok</CardTitle>
                <CardDescription className='text-xs'>
                  Bagaimana data bergerak dari gudang penyimpanan hingga ke laporan analitik akhir di Freashday.
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                {/* Horizontal Step-by-Step Flowchart */}
                <div className='relative hidden xl:flex justify-between items-start gap-4'>
                  {/* Connector lines behind */}
                  <div className='absolute top-10 left-10 right-10 h-0.5 bg-border z-0' />

                  {workflowSteps.map((ws, idx) => {
                    const IconComp = ws.icon
                    return (
                      <div key={idx} className='relative flex flex-col items-center text-center max-w-[200px] z-10'>
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center border-2 bg-background shadow-md ${ws.color} transition-transform duration-200 hover:scale-110`}>
                          <IconComp className='h-7 w-7' />
                        </div>
                        <div className='mt-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20'>
                          Langkah {ws.step}
                        </div>
                        <h4 className='text-xs font-bold mt-2 text-foreground'>{ws.title}</h4>
                        <p className='text-[10px] text-muted-foreground mt-1 leading-relaxed'>{ws.desc}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Vertical Step-by-Step for Mobile/Tablet */}
                <div className='flex xl:hidden flex-col gap-6 relative'>
                  {/* Connector line on left */}
                  <div className='absolute top-6 bottom-6 left-6 w-0.5 bg-border z-0' />

                  {workflowSteps.map((ws, idx) => {
                    const IconComp = ws.icon
                    return (
                      <div key={idx} className='flex gap-4 relative z-10 items-start'>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border bg-background shrink-0 shadow-sm ${ws.color}`}>
                          <IconComp className='h-5 w-5' />
                        </div>
                        <div className='space-y-0.5'>
                          <div className='flex items-center gap-2'>
                            <span className='text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded'>
                              Langkah {ws.step}
                            </span>
                            <h4 className='text-xs font-bold text-foreground'>{ws.title}</h4>
                          </div>
                          <p className='text-[11px] text-muted-foreground leading-relaxed'>{ws.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='border bg-card'>
                <CardHeader>
                  <CardTitle className='text-sm font-bold flex items-center gap-1.5'>
                    <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                    Metode FEFO (First-Expired, First-Out)
                  </CardTitle>
                </CardHeader>
                <CardContent className='text-xs text-muted-foreground leading-relaxed space-y-2'>
                  <p>
                    Berbeda dengan FIFO biasa, Freashday memprioritaskan batch produk dengan <strong>sisa umur simpan tersingkat (kadaluarsa tercepat)</strong> untuk dijual terlebih dahulu.
                  </p>
                  <p>
                    Saat melakukan simulasi transaksi di menu Nudging, sistem secara otomatis akan memotong kuantitas dari batch paling kritis di dalam inventori Anda terlebih dahulu.
                  </p>
                </CardContent>
              </Card>

              <Card className='border bg-card'>
                <CardHeader>
                  <CardTitle className='text-sm font-bold flex items-center gap-1.5'>
                    <Lightbulb className='h-4 w-4 text-amber-500' />
                    Mengapa Digital Nudging Penting?
                  </CardTitle>
                </CardHeader>
                <CardContent className='text-xs text-muted-foreground leading-relaxed space-y-2'>
                  <p>
                    Stok makanan segar yang membusuk di gudang adalah kerugian finansial bersih. Nudging membantu menarik minat pembeli di aplikasi ritel melalui pemberian insentif secara otomatis.
                  </p>
                  <p>
                    Diskon dinamis (flash discount) dan label kedaluwarsa cepat yang terpajang di etalase ritel terbukti mempercepat laju jual produk near-expiry hingga <strong>78%</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: PANDUAN MENU */}
          <TabsContent value='menus' className='mt-0 space-y-4 animate-in fade-in-50 duration-200'>
            {[
              {
                title: 'Dashboard Utama',
                icon: LayoutDashboard,
                desc: 'Halaman ringkasan status operasional logistik pangan segar.',
                features: [
                  'Menampilkan total taksiran kerugian pembusukan produk (Waste Risk Value).',
                  'Indikator efektivitas nudging ritel dalam menyelematkan produk dari pembuangan.',
                  'Status ringkasan level stok produk pangan di seluruh gudang.',
                  'Tombel pintas refreser "Perbarui Data" lokal untuk mensimulasikan pemuatan.',
                ],
              },
              {
                title: 'Inventory Management',
                icon: Package,
                desc: 'Manajemen pencatatan stok fisik dan kadaluarsa produk.',
                features: [
                  'Menyajikan data produk, SKU, Kode Batch, sisa hari kedaluwarsa, dan estimasi loss.',
                  'Fitur edit link gambar produk langsung dari baris tabel.',
                  'Dialog "Tambah Batch Baru" dengan opsi pendaftaran Kategori Baru secara dinamis.',
                  'Secara otomatis mengubah input nama kategori baru menjadi HURUF KAPITAL (UPPERCASE).',
                ],
              },
              {
                title: 'AI Forecasting',
                icon: Brain,
                desc: 'Analisis risiko masa kadaluarsa dan asisten pemesanan ulang (Reorder).',
                features: [
                  'Waste Risk Analysis: Tabel evaluasi sisa hari umur simpan dengan tombol pintas "Buat Nudge".',
                  'Reorder Recommendation: Tabulasi status pemesanan (Rekomendasi Aktif & Riwayat Pemesanan).',
                  'Modal Detail Produk: Klik pada nama produk di tabel mana saja untuk memunculkan gambar dan alasan AI.',
                  'Selektor Baris: Pilihan tampilan 5, 10, 25, atau 50 baris per halaman di semua tabel.',
                ],
              },
              {
                title: 'Digital Nudging',
                icon: BellRing,
                desc: 'Pusat pembuatan promo pintar terintegrasi dengan retail storefront.',
                features: [
                  'Buat Strategi: Form diskon persentase, tanggal mulai, dan target produk.',
                  'Pratinjau Toko Retail: Menampilkan etalase ritel real-time yang dilihat pelanggan ritel.',
                  'Simulasikan Pembelian: Memotong batch stok FEFO dan mencatatkan data log konversi.',
                  'Activity Logs: Histori impresi, klik, dan pembelian produk nudging.',
                ],
              },
              {
                title: 'Analytics & Trends',
                icon: BarChart3,
                desc: 'Laporan visual mendalam mengenai penurunan waste dan perputaran inventori.',
                features: [
                  'Grafik Waste Reduction: Tren persentase penurunan limbah pangan logistik.',
                  'Grafik Inventory Turnover: Tren kecepatan perputaran stok barang keluar-masuk.',
                  'Category Performance: Tabel dan bar chart performa tiap kategori produk.',
                  'AI Supply Chain Insights: Kartu rekomendasi cerdas yang dikelompokkan (grouping) per kategori.',
                ],
              },
            ].map((m, idx) => {
              const MenuIcon = m.icon
              return (
                <Card key={idx} className='border hover:border-emerald-500/20 transition-colors'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-bold flex items-center gap-2'>
                      <div className='p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 shrink-0'>
                        <MenuIcon className='h-4 w-4' />
                      </div>
                      {m.title}
                    </CardTitle>
                    <CardDescription className='text-xs'>{m.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className='pt-2'>
                    <ul className='space-y-1.5'>
                      {m.features.map((f, fIdx) => (
                        <li key={fIdx} className='text-xs text-muted-foreground flex items-start gap-2'>
                          <ArrowRight className='h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5' />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* TAB 3: RBAC */}
          <TabsContent value='rbac' className='mt-0 space-y-6 animate-in fade-in-50 duration-200'>
            <Card className='border shadow-xs text-start'>
              <CardHeader>
                <CardTitle className='text-base font-bold'>Kebijakan Keamanan Peran & Hak Akses (RBAC)</CardTitle>
                <CardDescription className='text-xs'>
                  Sistem keamanan membatasi akses halaman dan tindakan tombol berdasarkan peran pengguna yang login.
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='overflow-x-auto w-full'>
                  <table className='w-full text-xs text-muted-foreground border-collapse'>
                    <thead>
                      <tr className='border-b bg-muted/50'>
                        <th className='p-3 text-start font-bold text-foreground'>Fitur / Modul</th>
                        <th className='p-3 text-center font-bold text-foreground'>Administrator</th>
                        <th className='p-3 text-center font-bold text-foreground'>Logistics Manager</th>
                        <th className='p-3 text-center font-bold text-foreground'>Marketing Manager</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b hover:bg-muted/10'>
                        <td className='p-3 font-semibold text-foreground'>Manajemen Akun User</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-red-500'>Tidak Dapat Masuk</td>
                        <td className='p-3 text-center text-red-500'>Tidak Dapat Masuk</td>
                      </tr>
                      <tr className='border-b hover:bg-muted/10'>
                        <td className='p-3 font-semibold text-foreground'>Kelola Batch & Kategori (Inventory)</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-muted-foreground'>Hanya Lihat (Read-Only)</td>
                      </tr>
                      <tr className='border-b hover:bg-muted/10'>
                        <td className='p-3 font-semibold text-foreground'>Persetujuan Reorder & AI Forecast</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-red-500'>Tidak Dapat Masuk</td>
                      </tr>
                      <tr className='border-b hover:bg-muted/10'>
                        <td className='p-3 font-semibold text-foreground'>Kelola Strategi Nudging</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-red-500'>Tidak Dapat Masuk</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                      </tr>
                      <tr className='border-b hover:bg-muted/10'>
                        <td className='p-3 font-semibold text-foreground'>Grafik Analytics & AI Insights</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                        <td className='p-3 text-center text-emerald-600 font-bold'>Akses Penuh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className='mt-6 rounded-lg border p-4 bg-muted/20 flex gap-3.5 items-start text-xs leading-relaxed'>
                  <AlertTriangle className='h-5 w-5 text-amber-600 shrink-0 mt-0.5' />
                  <div className='space-y-1'>
                    <h5 className='font-bold text-foreground'>Catatan Penting Keamanan:</h5>
                    <p>
                      Pembatasan peran (RBAC) diterapkan secara ganda pada sisi <strong>Backend (API endpoint routing guards)</strong> dan <strong>Frontend (UI component locks)</strong>. Jika pengguna memotong akses secara manual (mengubah URL), NestJS akan segera melempar status `403 Forbidden` dan menolak transaksi data demi keamanan sistem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
