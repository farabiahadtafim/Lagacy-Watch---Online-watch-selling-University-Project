import ShopPage from '../page';

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const sParams = await searchParams;
  return <ShopPage searchParams={{ ...sParams, category }} />;
}
