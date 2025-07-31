Cahier des charges fonctionnel

L'objectif est de réaliser un site internet ayant pour but de présenter mon profil profesionnel.

Le site devra comporter plusieurs grandes thématiques :
- Un portfolio dans lequel je pourrais mettre tous les projets que j'ai fais
- Une page d'accueil du site avec une petite présentation, un bouton pour télécharger le CV, et une description plus longue éditable à souhait en markdown via panel admin.
- Un blog dans lequel je pourrais raconter ma vie

Technologies à utiliser :
FRONTEND : React + Typescript
BACKEND : Express, Stockage de données en json multifichiers structurés par dossiers (pour la simplicité)

- Le site devra avoir un système de login pour se connecter avec un compte administrateur

utilisation de JWT pour la gestion des utilisateurs

Il devra y avoir une page de panel administrateur, on ne peut y accéder que si on est connecté en admin, et on peut dessus y gérer les différents projets affichés dans le portfolio, les post de blogs, la page d'accueil, mon CV.

Fonctionnement de la page d'accueil :
- On retrouve une phrase de présentation type "Bonjour, je suis Pierre Lihoreau..."
- Un bouton "Télécharger mon CV"
- Des informations de contact : Email, Tel, paramétrable via panel admin.
- Plus bas on retrouve le contenu markdown customisable de la page d'accueil.

Fonctionnement du portfolio :
- On retrouve une liste de projet, depuis le panel admin on peut créer des projets avec un titre, une déscription courte, une déscription longue en markdown, une image de miniature.
- Possibilité d'organiser librement la liste de projets, choisir l'ordre d'affichage.
- Possibilité de changer la visibilité des projets : Publique, non répertorié, privé


Fonctionnement du blog :
- Possibilité de créer des articles de blog : titre, description courte, contenu en markdown, date affichée.
- L'ordre d'affiche des blogpost est personnalisable, je peux librement choisir l'ordre d'affichage
- La date de publication d'un blog est choisissable, je peux donc "mentir" sur les dates de publication


Style d'UI :
UI Sobre, moderne, responsive, réspectant les normes de taille de texte

Footer commun sur toutes les page :
- Powered by Let's PopP ! (avec redirection web quand on clique sur https://lets-pop.fr/)
- Réseaux : LinkedIn, Instagram, Youtube, etc... Liste des réseaux customisable via panel admin, on peut en ajouter autant qu'on veut.