# 📧 Guide Rapide - Configuration Email (5 minutes)

## 🎯 Objectif

Recevoir les messages du formulaire de contact sur **preneuscliford@gmail.com**

## ⚡ Solution Rapide avec Resend (Recommandé)

### Étape 1: Créer un compte Resend (2 min)

1. Aller sur https://resend.com/signup
2. Créer un compte gratuit (100 emails/jour)
3. Confirmer votre email

### Étape 2: Obtenir la clé API (1 min)

1. Dans le dashboard Resend, aller dans "API Keys"
2. Cliquer sur "Create API Key"
3. Copier la clé (commence par `re_...`)

### Étape 3: Configurer le projet (2 min)

1. **Créer le fichier `.env.local`** à la racine du projet :

   ```bash
   # Dans PowerShell, à la racine du projet
   New-Item -Path ".env.local" -ItemType File
   ```

2. **Ajouter la clé API** dans `.env.local` :

   ```env
   RESEND_API_KEY=re_votre_clé_copiée_ici
   ```

3. **Installer Resend** :

   ```bash
   npm install resend
   ```

4. **Modifier `app/api/contact/route.ts`** :

   Remplacer tout le contenu par :

   ```typescript
   import { NextResponse } from "next/server";
   import { Resend } from "resend";

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: Request) {
     try {
       const body = await request.json();
       const { name, email, subject, message } = body;

       if (!name || !email || !subject || !message) {
         return NextResponse.json(
           { error: "Tous les champs sont requis" },
           { status: 400 }
         );
       }

       // Envoyer l'email
       const { data, error } = await resend.emails.send({
         from: "MCGuyane Contact <onboarding@resend.dev>", // Email de test Resend
         to: "preneuscliford@gmail.com",
         subject: `[Contact MCGuyane] ${subject}`,
         replyTo: email,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
             <h2 style="color: #7c3aed;">Nouveau message de contact - MCGuyane</h2>
             
             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <p><strong>Nom:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Sujet:</strong> ${subject}</p>
             </div>
             
             <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
               <h3 style="color: #374151; margin-top: 0;">Message:</h3>
               <p style="color: #6b7280; line-height: 1.6;">${message}</p>
             </div>
             
             <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
               <p style="margin: 0; font-size: 14px; color: #92400e;">
                 💡 Pour répondre, cliquez sur "Répondre" ou utilisez l'email: ${email}
               </p>
             </div>
           </div>
         `,
       });

       if (error) {
         console.error("Erreur Resend:", error);
         return NextResponse.json(
           { error: "Erreur lors de l'envoi de l'email" },
           { status: 500 }
         );
       }

       console.log("✅ Email envoyé avec succès:", data);
       return NextResponse.json(
         { success: true, message: "Message envoyé avec succès" },
         { status: 200 }
       );
     } catch (error) {
       console.error("Erreur:", error);
       return NextResponse.json(
         { error: "Erreur lors de l'envoi du message" },
         { status: 500 }
       );
     }
   }
   ```

5. **Redémarrer le serveur** :
   ```bash
   # Arrêter le serveur (Ctrl+C dans le terminal)
   # Relancer
   npm run dev
   ```

### Étape 4: Tester

1. Aller sur http://localhost:3000/contact
2. Remplir le formulaire
3. Envoyer
4. Vérifier votre boîte `preneuscliford@gmail.com` (et les spams)

## 📝 Notes Importantes

### Email expéditeur

- Au début, utilisez `onboarding@resend.dev` (fourni par Resend)
- Plus tard, vous pourrez configurer votre propre domaine (`contact@mcguyane.com`)

### Limites gratuites Resend

- 100 emails par jour
- 3,000 emails par mois
- Largement suffisant pour débuter

### Vérifier les logs

Si ça ne marche pas, regardez :

1. Les logs du terminal où tourne `npm run dev`
2. Les emails dans les spams Gmail
3. Le dashboard Resend pour voir les emails envoyés

## ❌ Problèmes courants

### "API key invalide"

- Vérifiez que la clé commence par `re_`
- Vérifiez qu'il n'y a pas d'espaces dans `.env.local`
- Redémarrez le serveur après avoir créé `.env.local`

### "Email non reçu"

- Vérifiez les spams
- Attendez 1-2 minutes
- Vérifiez le dashboard Resend pour voir si l'email est parti

### ".env.local ignoré"

- Le fichier doit être à la racine (à côté de `package.json`)
- Nom exact : `.env.local` (avec le point au début)
- Redémarrer le serveur après création

## 🎉 Une fois configuré

Vous recevrez un email comme celui-ci :

```
De: MCGuyane Contact
À: preneuscliford@gmail.com
Sujet: [Contact MCGuyane] [Le sujet du visiteur]

Nouveau message de contact - MCGuyane

Nom: [Nom du visiteur]
Email: [Email du visiteur]
Sujet: [Sujet]

Message:
[Le message du visiteur]

💡 Pour répondre, cliquez sur "Répondre" ou utilisez l'email: [email]
```

Vous pourrez répondre directement en cliquant sur "Répondre" dans Gmail !
