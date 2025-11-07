🌤️ WeatherAPI

WeatherAPI est un projet d’API météo développé avec Node.js et Express.
Ce projet a pour but d’explorer la création d’une API simple autour des données météorologiques,
avec gestion de villes et de leurs bulletins météo enregistrés dans des fichiers JSON locaux.

📚 À propos

WeatherAPI permet :
    •    de gérer les villes (création, lecture, modification, suppression)
    •    d’ajouter et de consulter des bulletins météo
    •    de calculer la tendance météo dominante d’une ville

Le projet est développé en TypeScript et repose sur :
    •    Node.js + Express
    •    Fichiers JSON pour simuler une base de données
    •    Vitest + Supertest pour les tests unitaires

🚀 Routes disponibles

🏙️ VILLES

GET /
→ Message d’accueil
Réponse :
{ “message”: “Bienvenue sur WeatherAPI !” }

GET /cities
→ Liste toutes les villes
Réponse :
[
{ “zipCode”: “75000”, “name”: “Paris” },
{ “zipCode”: “69000”, “name”: “Lyon” }
]

GET /cities/{zipCode}
→ Détail d’une ville spécifique
Réponse :
{ “zipCode”: “75000”, “name”: “Paris” }

POST /cities
→ Ajoute une nouvelle ville
Body :
{ “zipCode”: “75000”, “name”: “Paris” }
Réponse :
{ “message”: “Ville ajoutée”, “city”: { “zipCode”: “75000”, “name”: “Paris” } }

PUT /cities/{zipCode}
→ Modifie le nom d’une ville
Body :
{ “name”: “Paris Centre” }
Réponse :
{ “message”: “Nom de la ville mise à jour”, “city”: { “zipCode”: “75000”, “name”: “Paris Centre” } }

DELETE /cities/{zipCode}
→ Supprime une ville
Réponse :
{ “message”: “Ville supprimée”, “city”: { “zipCode”: “75000”, “name”: “Paris” } }

🌦️ MÉTÉO

GET /cities/{zipCode}/weather
→ (Route alternative) Affiche la météo dominante d’une ville
Réponse :
{ “zipCode”: “75000”, “name”: “Paris”, “weather”: “beau” }

POST /cities/{zipCode}/weather
→ Ajoute un bulletin météo pour une ville donnée
Body :
{ “zipCode”: “75000”, “weather”: “pluie” }
Réponse :
{ “message”: “Bulletin météo ajouté :”, “weather”: “pluie”, “id”: 1 }

DELETE /weather/{id}
→ Supprime un bulletin météo selon son identifiant
Réponse :
{}

🧑‍💻 Auteurs

Projet réalisé par Victor & Valentin.