import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopLayout from '@/components/ShopLayout';
import api from '@/lib/api';

async function getProducts(searchParams) {
  try {
    const res = await api.get('/products', { params: searchParams });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function ShopPage({ searchParams }) {
  const sParams = await searchParams;
  const products = await getProducts(sParams);

  return (
    <main className="min-h-screen pt-40 bg-white">
      <Navbar />
      <ShopLayout products={products} initialParams={sParams} />
      <Footer />
    </main>
  );
}
