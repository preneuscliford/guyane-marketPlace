export function Categories() {
  const categories = [
    { name: 'Artisanat', icon: '/images/craft.svg' },
    { name: 'Services', icon: '/images/services.svg' },
    { name: 'Agriculture', icon: '/images/agriculture.svg' },
    { name: 'Tourisme', icon: '/images/tourism.svg' },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Catégories populaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez nos principales catégories de services locaux
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-purple-500 transition-colors text-center"
            >
              <img 
                src={category.icon} 
                alt={category.name}
                className="w-16 h-16 mx-auto mb-4 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
