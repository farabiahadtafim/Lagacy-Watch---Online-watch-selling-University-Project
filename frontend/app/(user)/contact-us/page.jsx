import InfoLayout from '@/components/InfoLayout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactUs() {
  return (
    <InfoLayout title="Get in Touch">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Our Flagship Store</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-gold shrink-0" />
                <p>Level 4, Block C, Bashundhara City Shopping Mall, Panthapath, Dhaka 1215</p>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-gold shrink-0" />
                <p>+880 1700-000000</p>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-gold shrink-0" />
                <p>support@legacywatches.com</p>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <p>Saturday - Thursday: 10:00 AM - 8:00 PM</p>
                  <p>Friday: 2:30 PM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold" />
            <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold" />
            <textarea placeholder="How can we help?" rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold"></textarea>
            <button className="w-full gold-gradient text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">Send Message</button>
          </form>
        </div>
      </div>
    </InfoLayout>
  );
}
