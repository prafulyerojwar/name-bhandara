import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-stone-900 to-stone-800 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🪔</span>
              <div>
                <h3 className="text-white text-xl font-bold">Nam Bhandara</h3>
                <p className="text-orange-400 text-sm">भंडारा | Food for All 🙏</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Connecting food donors with NGOs and people in need across Maharashtra.
              Every meal shared is a blessing. <span className="text-orange-400">अन्नदान महादान।</span>
            </p>
            <div className="flex gap-4 mt-4 text-2xl">
              <span title="Ganesh Chaturthi">🐘</span>
              <span title="Diya">🪔</span>
              <span title="Lotus">🪷</span>
              <span title="Prasadam">🍛</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/map" className="hover:text-orange-400 transition-colors">Live Bhandara Map</Link></li>
              <li><Link href="/auth/register" className="hover:text-orange-400 transition-colors">Register as Donor</Link></li>
              <li><Link href="/auth/register" className="hover:text-orange-400 transition-colors">Register as NGO</Link></li>
              <li><Link href="/post-bhandara" className="hover:text-orange-400 transition-colors">Post a Bhandara</Link></li>
            </ul>
          </div>

          {/* Festivals */}
          <div>
            <h4 className="text-white font-semibold mb-4">Festivals We Serve</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span>🐘</span> Ganesh Chaturthi</li>
              <li className="flex items-center gap-2"><span>🪔</span> Diwali / Navratri</li>
              <li className="flex items-center gap-2"><span>🌸</span> Ram Navami</li>
              <li className="flex items-center gap-2"><span>🌺</span> Hanuman Jayanti</li>
              <li className="flex items-center gap-2"><span>🙏</span> Temple Prasadam</li>
              <li className="flex items-center gap-2"><span>💒</span> Weddings & Events</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © 2024 Nam Bhandara. Made with ❤️ for Maharashtra.
          </p>
          <p className="text-xs text-stone-500">
            Pilot: Maharashtra State 🗺️ | Expanding across India soon!
          </p>
        </div>
      </div>
    </footer>
  );
}
