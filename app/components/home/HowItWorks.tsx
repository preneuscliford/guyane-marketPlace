export function HowItWorks() {
  const steps = [
    {
      title: "Inscription facile",
      description: "Créez votre compte en 2 minutes",
      icon: "/images/signup.svg"
    },
    {
      title: "Publication rapide",
      description: "Déposez votre annonce en quelques clics",
      icon: "/images/post.svg"
    },
    {
      title: "Communication directe",
      description: "Échangez via notre messagerie sécurisée",
      icon: "/images/chat.svg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour utiliser la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center">
              <img
                src={step.icon}
                alt={step.title}
                className="w-20 h-20 mx-auto mb-6"
              />
              <div className="mb-4">
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
