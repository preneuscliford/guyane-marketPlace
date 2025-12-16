/**
 * Fonction utilitaire pour réessayer une opération async avec délai exponentiel
 * @param asyncFn Fonction asynchrone à exécuter
 * @param maxRetries Nombre maximum de tentatives (par défaut 3)
 * @param baseDelay Délai de base en ms (par défaut 500ms)
 * @returns Résultat de la fonction ou undefined après tous les échecs
 */
export async function retryWithExponentialBackoff<T>(
  asyncFn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 500
): Promise<T | undefined> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${attempt + 1}/${maxRetries} failed:`,
        error
      );

      // Attendre avant de retenter (délai exponentiel)
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Tous les tentatives échouées
  console.error("All retry attempts failed:", lastError);
  throw lastError;
}
