export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            StartUp
          </h1>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#tech" className="hover:text-blue-400 transition-colors">
              Tech Stack
            </a>
            <a href="#cta" className="hover:text-blue-400 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
            🚀 Modern Next.js Starter Template
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Your{" "}
            <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Next Project
            </span>
            {" "}Faster
          </h2>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            A modern, production-ready Next.js starter template with TypeScript, Tailwind CSS, and best practices baked in. Start your startup journey here.
          </p>

          <div id="cta" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95">
              Get Started
            </button>
            <button className="px-8 py-4 border border-gray-600 hover:border-blue-400 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900/50 border-t border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16">Powerful Features</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Built with Next.js 16 for optimal performance and fast page loads."
              },
              {
                icon: "🎨",
                title: "Modern Design",
                desc: "Beautiful UI with Tailwind CSS and dark mode support out of the box."
              },
              {
                icon: "🔒",
                title: "Type Safe",
                desc: "Full TypeScript support for a robust and maintainable codebase."
              },
              {
                icon: "📱",
                title: "Responsive",
                desc: "Mobile-first responsive design that works perfectly on all devices."
              },
              {
                icon: "🛠️",
                title: "Dev Ready",
                desc: "Pre-configured ESLint and best practices for clean code."
              },
              {
                icon: "🚀",
                title: "Deploy Ready",
                desc: "Optimized for deployment on Vercel and other platforms."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-colors hover:bg-blue-500/5">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16">Built With Modern Tech</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Next.js 16", desc: "React framework" },
              { name: "React 19", desc: "UI library" },
              { name: "TypeScript", desc: "Type safety" },
              { name: "Tailwind CSS", desc: "Styling" }
            ].map((tech, i) => (
              <div key={i} className="p-6 rounded-lg bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700">
                <h4 className="font-semibold text-lg mb-1">{tech.name}</h4>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Start?</h3>
          <p className="text-gray-400 mb-8 text-lg">
            Clone the repository, install dependencies, and start building your next great idea.
          </p>
          <button className="px-12 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95">
            Clone Template
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© 2026 StartUp. Built with Next.js and ❤️</p>
      </footer>
    </div>
  );
}
