import { MetadataRoute } from 'next'

const BASE_URL = 'https://nexriseexports.com'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    '',
    '/products',
    '/about',
    '/spices',
    '/contact',
    '/import-guide',
    '/license',
    '/team',
    '/testimonials',
    '/blog',
    '/faqs',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic products
  let productRoutes: any[] = []
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=100&status=active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.products) {
        productRoutes = data.data.products.map((product: any) => {
          const slug = (product.propertyTitle || product.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          
          return {
            url: `${BASE_URL}/products/${slug}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.7,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return [...routes, ...productRoutes]
}
