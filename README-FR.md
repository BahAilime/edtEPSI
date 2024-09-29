# Extracteur d'Emploi du Temps EPSI

Ce projet permet d'extraire votre emploi du temps hebdomadaire depuis le site de l'école EPSI.

## Fonctionnalités

- Extraction de votre emploi du temps hebdomadaire depuis le site EPSI.
- Les identifiants peuvent être fournis via le fichier `.env` ou en tant qu'arguments en ligne de commande.
- Spécifiez la semaine à l'aide d'une date, et l'outil récupérera les événements correspondants.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/bahailime/edtepsi.git
   cd edtepsi
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre environnement :
   - Créez un fichier `.env` à la racine du projet et ajoutez vos identifiants EPSI :
     ```bash
     USERNAME_EPSI=votre_nom.prenom
     PASSWORD_EPSI=votre_mot_de_passe
     ```
   - Ou bien, fournissez les identifiants via des arguments en ligne de commande lors de l'exécution du script (voir ci-dessous).

## Utilisation

Vous pouvez exécuter le script avec Node.js et des arguments optionnels.

### Arguments (tous optionnels) :

- `--date=[JJ/MM/AAAA]` : Jour dans la semaine pour lequel vous voulez obtenir l'emploi du temps. Si non fourni, la semaine actuelle est utilisée.
- `--week` : Numéro de la semaine dont tu veux extraire l'emploi du temps (--date à la  priorité).
- `--year` : (par defaut: année en cours) Si vous voulez récupérer une semaine qui n'est pas dans l'année en cours.
- `--output` : Le chemin vers où vous voulez sauvgarder le JSON.
- `--username` : Votre nom d'utilisateur EPSI (prenom.nom généralement).
- `--password` : Votre mot de passe EPSI.

### Exemple :

```bash
node index.js --date=25/09/2024 --username=michel.durand --password=mot_de_passe
```

Si vos identifiants sont dans le fichier `.env`, la commande sera plus simple :

```bash
node index.js --date=25/09/2024
```

## Licence

Ce projet est sous licence MIT.