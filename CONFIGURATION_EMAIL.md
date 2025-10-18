# Configuration de l'envoi d'emails pour le formulaire de contact

## État actuel

Le formulaire de contact est configuré pour envoyer les messages à `preneuscliford@gmail.com`, mais l'envoi d'email n'est pas encore complètement configuré.

Les messages sont actuellement loggés dans la console du serveur. Pour activer l'envoi réel d'emails, vous devez configurer un service d'email.

## Options recommandées

### Option 1: Resend (Recommandé - Simple et gratuit pour débuter)

1. **Créer un compte sur [Resend](https://resend.com)**

   - 100 emails/jour gratuits
   - Configuration très simple
   - Parfait pour Next.js

2. **Installation**

   ```bash
   npm install resend
   ```

3. **Configuration**

   - Obtenez votre clé API sur resend.com
   - Ajoutez dans `.env.local`:
     ```
     RESEND_API_KEY=re_votre_clé_api
     ```

4. **Décommentez le code dans `app/api/contact/route.ts`** (lignes 23-37)

### Option 2: SendGrid

1. **Créer un compte sur [SendGrid](https://sendgrid.com)**

   - 100 emails/jour gratuits

2. **Installation**

   ```bash
   npm install @sendgrid/mail
   ```

3. **Configuration**

   ```typescript
   import sgMail from "@sendgrid/mail";
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

   await sgMail.send({
     to: "preneuscliford@gmail.com",
     from: "contact@mcguyane.com", // doit être vérifié sur SendGrid
     subject: `[Contact MCGuyane] ${subject}`,
     text: message,
     html: `<p>${message}</p>`,
   });
   ```

### Option 3: Nodemailer avec Gmail

⚠️ **Important**: Gmail bloque les connexions non sécurisées. Vous devez utiliser un "App Password".

1. **Installation**

   ```bash
   npm install nodemailer
   ```

2. **Créer un App Password Gmail**

   - Allez sur votre compte Google
   - Sécurité → Validation en deux étapes → Mots de passe des applications
   - Créez un mot de passe pour "Mail"

3. **Configuration**

   ```typescript
   import nodemailer from "nodemailer";

   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: "preneuscliford@gmail.com",
       pass: process.env.GMAIL_APP_PASSWORD, // App Password, pas votre mot de passe normal
     },
   });

   await transporter.sendMail({
     from: "preneuscliford@gmail.com",
     to: "preneuscliford@gmail.com",
     subject: `[Contact MCGuyane] ${subject}`,
     html: `
       <h2>Nouveau message de contact</h2>
       <p><strong>Nom:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Message:</strong></p>
       <p>${message}</p>
     `,
   });
   ```

## Recommandation

Je recommande **Resend** car :

- Configuration la plus simple
- 100 emails/jour gratuits suffisants pour commencer
- Excellente intégration avec Next.js
- Support de React Email pour de beaux emails
- Pas besoin de gérer les App Passwords

## Test

Une fois configuré, testez en :

1. Remplissant le formulaire sur `/contact`
2. Vérifiant votre boîte mail `preneuscliford@gmail.com`
3. Vérifiant les logs du serveur pour les erreurs

## Variables d'environnement nécessaires

Créez un fichier `.env.local` à la racine du projet :

```env
# Pour Resend
RESEND_API_KEY=re_votre_clé_api

# OU pour SendGrid
SENDGRID_API_KEY=SG.votre_clé_api

# OU pour Gmail
GMAIL_APP_PASSWORD=votre_app_password
```

⚠️ **Ne commitez JAMAIS le fichier `.env.local` dans Git !**
