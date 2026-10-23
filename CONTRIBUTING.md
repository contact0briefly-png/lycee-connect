# Guide de Contribution à LycéeConnect

Merci de votre intérêt pour **LycéeConnect**, le système open-source de gestion d'établissement secondaire adapté aux lycées d'enseignement général et technique (modèle francophone / Togo).

## Comment contribuer ?

1. **Forkez** le dépôt sur GitHub.
2. **Clonez** votre fork localement :
   ```bash
   git clone https://github.com/<votre-username>/lycee-connect.git
   cd lycee-connect
   ```
3. **Créez une branche** pour votre fonctionnalité ou correctif :
   ```bash
   git checkout -b feat/nouvelle-fonctionnalite
   ```
4. **Installez les dépendances et lancez les tests** :
   ```bash
   npm install
   npm test
   ```
5. **Soumettez une Pull Request** avec une description claire des changements apportés.

## Idées d'améliorations bienvenues

- Ajout des séries d'enseignement technique et professionnel (**E, F1, F2, F3, F4, G1, G2, G3**, **Ti**).
- Export PDF natif des bulletins trimestriels et des cartes scolaires avec QR Code.
- Notifications SMS / WhatsApp aux parents d'élèves (absences, rappels d'écolage, publication des résultats).
- Mode hors-ligne (PWA / Service Worker) pour les établissements à connectivité limitée.
- Gestion des examens blancs (Probatoire / BAC I et Baccalauréat / BAC II).
