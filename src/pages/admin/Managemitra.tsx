import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Loader2,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { partnersAPI } from '@/lib/api';
import { Partner } from '@/types/partner.types';
import { cn } from '@/lib/utils';

export default function ManageMitra() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchCities();
    fetchPartners();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [selectedCity, selectedStatus, searchQuery]);

  const fetchCities = async () => {
    try {
      const response = await partnersAPI.getAvailableCities();
      if (response.data.success) {
        setCities(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (selectedCity !== 'all') {
        params.kota = selectedCity;
      }
      
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await partnersAPI.getAll(params);
      if (response.data.success) {
        setPartners(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus mitra "${nama}"?`)) {
      return;
    }

    try {
      await partnersAPI.delete(id.toString());
      fetchPartners();
      alert('Mitra berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('Gagal menghapus mitra!');
    }
  };

  const cleanCityName = (cityName: string): string => {
    return cityName
      .replace(/^KABUPATEN\s+/i, '')
      .replace(/^KOTA\s+/i, '')
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/dashboard/admin')}
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  Kelola Mitra
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage semua mitra laundry
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/dashboard/admin/partners/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Mitra
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari nama mitra, email, atau telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Filter Kota */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-[200px] h-12">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Semua Kota" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kota</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {cleanCityName(city)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Status */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[180px] h-12">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Semua Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Info */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{partners.length}</span> mitra
                {selectedCity !== 'all' && (
                  <span> di <span className="font-semibold text-primary">{cleanCityName(selectedCity)}</span></span>
                )}
                {searchQuery && (
                  <span> untuk pencarian "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>
                )}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Memuat data mitra...</p>
                </div>
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tidak Ada Mitra</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCity !== 'all' 
                    ? 'Tidak ada mitra yang sesuai dengan filter'
                    : 'Belum ada mitra yang terdaftar'}
                </p>
                {(searchQuery || selectedCity !== 'all' || selectedStatus !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedStatus('all');
                    }}
                    variant="outline"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Nama Toko</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner, index) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.nama_toko}</p>
                            <p className="text-xs text-muted-foreground">{partner.alamat}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{cleanCityName(partner.kota || '-')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{partner.no_telepon}</span>
                            </div>
                            {partner.user && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs">{partner.user.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                              partner.status === 'active'
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                            )}
                          >
                            {partner.status === 'active' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {partner.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => navigate(`/dashboard/admin/partners/${partner.id}`)}
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </Button>
                            <Button
                              onClick={() => navigate(`/dashboard/admin/partners/${partner.id}/edit`)}
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-primary hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(partner.id, partner.nama_toko)}
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}