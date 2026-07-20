import InfoLayout from '@/components/InfoLayout';

export default function AboutUs() {
  return (
    <InfoLayout title="Our Legacy">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Crafting Time Since 2010</h2>
        <p>
          Legacy Watches began with a simple passion: to bring the world's most exquisite timepieces to the heart of Bangladesh. What started as a small boutique has grown into the nation's premier destination for luxury watches, serving thousands of collectors and enthusiasts with integrity and expertise.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p>
          We believe that a watch is more than just a tool for telling time; it is a statement of character, a celebration of engineering, and a legacy to be passed down through generations. Our mission is to curate a collection that represents the pinnacle of craftsmanship, style, and value.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>100% Authentic Products directly from brands.</li>
          <li>Official Warranty and after-sales service.</li>
          <li>Expert consultations for collectors.</li>
          <li>Secure and fast delivery across Bangladesh.</li>
        </ul>
      </section>
    </InfoLayout>
  );
}
