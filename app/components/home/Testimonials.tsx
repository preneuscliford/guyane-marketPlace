export function Testimonials() {
  const testimonials = [
    {
      name: "Marie D.",
      role: "Artisan",
      text: "Cette plateforme m'a permis de développer mon activité rapidement. Très simple à utiliser !",
      avatar: "/images/avatar1.jpg"
    },
    {
      name: "Paul T.",
      role: "Particulier",
      text: "J'ai trouvé un excellent service de réparation en moins d'une heure. Je recommande !",
      avatar: "/images/avatar2.jpg"
    },
    {
      name: "Sarah K.",
      role: "Commerçante",
      text: "Une vraie bouffée d'air frais pour l'économie locale. Fière de faire partie de cette communauté.",
      avatar: "/images/avatar3.jpg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Témoignages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que disent nos utilisateurs satisfaits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">«&nbsp;{testimonial.text}&nbsp;»</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
