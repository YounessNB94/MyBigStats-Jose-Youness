# MyBigStats

Plateforme web permettant de retracer les statistiques de différents sports (foot, MMA, etc.).

Projet réalisé dans le cadre du cours JavaScript/TypeScript.

## Auteurs

- Monkam Jose
- Youness NAIT BELKACEM

## Contexte

Le projet consiste à construire une plateforme un minimum ergonomique et surtout fonctionnelle, à partir d'un squelette HTML fourni et d'une API externe. L'ensemble de la logique (manipulation du DOM, gestion de l'asynchrone, typage) est à implémenter en TypeScript, sans framework.

## Objectifs pédagogiques

- Appliquer l'ensemble des notions abordées en cours
- Manipuler le DOM
- Maîtriser les problématiques d'asynchronisme
- Utilisation de TypeScript et de ses outils

## Fonctionnalités

- Une page par sport
- Une page d'accueil avec les événements en cours
- Sur chaque page, différents onglets : stats, historique, joueur/combattant
- Une barre de recherche pour les athlètes
- Différents filtres (sport, position)
- Un comparateur entre 2 athlètes (statistiques sous forme de graphique ou textuel)
- Gestion et notification des erreurs à l'utilisateur (API indisponible, sport inexistant, athlètes de sports différents)

## Ressources / API

- Sports : https://keligmartin.github.io/api/sports.json
- Athlètes : https://keligmartin.github.io/api/athletes.json
- Rencontres : https://keligmartin.github.io/api/rencontres.json
- Équipes : https://keligmartin.github.io/api/equipes.json

## Contraintes

- Aucun framework autorisé : uniquement les outils de base de JS & TS
- Le code doit être propre, maîtrisé par l'ensemble du groupe, et faire un usage pertinent des types utilitaires (`Partial`, `Utility Types`, etc.)

## Notation

| Critère | Points |
|---|---|
| Code et architecture propres et fonctionnels | 4 |
| Utilisation pertinente des types (utility, partial) | 2 |
| Gestion et notification des erreurs | 2 |
| Ensemble des fonctionnalités implémenté | 4 |
| Code maîtrisé par l'ensemble du groupe | 4 |
| Bonus (apport personnel) | 4 |
| **Total** | **20** |
