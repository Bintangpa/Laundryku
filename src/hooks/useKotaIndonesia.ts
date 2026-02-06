import { useState, useEffect } from 'react';

interface Kota {
  id: string;
  nama: string;
}

interface Province {
  id: string;
  nama: string;
}

/**
 * Custom hook untuk fetch data kota-kota di Indonesia
 * Menggunakan API Wilayah Indonesia (emsifa.com)
 * 
 * @returns {Object} - { kota, loading, error }
 */
export function useKotaIndonesia() {
  const [kota, setKota] = useState<Kota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKota = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch semua provinsi
        const provinsiResponse = await fetch(
          'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'
        );

        if (!provinsiResponse.ok) {
          throw new Error('Gagal mengambil data provinsi');
        }

        const provinsiData: Province[] = await provinsiResponse.json();

        // Step 2: Fetch kabupaten/kota dari setiap provinsi
        const allKotaPromises = provinsiData.map(async (provinsi) => {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsi.id}.json`
          );
          return response.json();
        });

        const allKotaArrays = await Promise.all(allKotaPromises);
        
        // Step 3: Flatten dan format data
        const allKota: Kota[] = allKotaArrays
          .flat()
          .map((item: any) => ({
            id: item.id,
            nama: item.name,
          }))
          .sort((a, b) => a.nama.localeCompare(b.nama, 'id')); // Sort alphabetically

        setKota(allKota);
      } catch (err) {
        console.error('Error fetching kota:', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data kota');
        
        // Fallback: gunakan data statis kota-kota besar jika API gagal
        setKota(getFallbackKota());
      } finally {
        setLoading(false);
      }
    };

    fetchKota();
  }, []);

  return { kota, loading, error };
}

/**
 * Fallback data: Kota-kota besar di Indonesia
 * Digunakan jika API gagal
 */
function getFallbackKota(): Kota[] {
  return [
    { id: '1', nama: 'Jakarta' },
    { id: '2', nama: 'Surabaya' },
    { id: '3', nama: 'Bandung' },
    { id: '4', nama: 'Bekasi' },
    { id: '5', nama: 'Medan' },
    { id: '6', nama: 'Tangerang' },
    { id: '7', nama: 'Depok' },
    { id: '8', nama: 'Semarang' },
    { id: '9', nama: 'Palembang' },
    { id: '10', nama: 'Makassar' },
    { id: '11', nama: 'Bogor' },
    { id: '12', nama: 'Batam' },
    { id: '13', nama: 'Pekanbaru' },
    { id: '14', nama: 'Bandar Lampung' },
    { id: '15', nama: 'Padang' },
    { id: '16', nama: 'Malang' },
    { id: '17', nama: 'Denpasar' },
    { id: '18', nama: 'Samarinda' },
    { id: '19', nama: 'Tasikmalaya' },
    { id: '20', nama: 'Banjarmasin' },
    { id: '21', nama: 'Pontianak' },
    { id: '22', nama: 'Cimahi' },
    { id: '23', nama: 'Balikpapan' },
    { id: '24', nama: 'Jambi' },
    { id: '25', nama: 'Surakarta' },
    { id: '26', nama: 'Serang' },
    { id: '27', nama: 'Manado' },
    { id: '28', nama: 'Yogyakarta' },
    { id: '29', nama: 'Cilegon' },
    { id: '30', nama: 'Kupang' },
  ].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
}