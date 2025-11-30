# ✅ GitHub Actions Workflows - Configuration Complète

**Date** : 30 Novembre 2025  
**Effectué par** : Agent Architecte Nx

---

## 🎯 Résumé

Deux workflows GitHub Actions distincts ont été configurés :
1. ✅ **CI Main (Strict)** - Validation complète sur push main
2. ✅ **CI Pull Request (Souple)** - Build seulement sur PR

---

## 📂 Fichiers Créés/Modifiés

### ✅ `.github/workflows/ci.yml` - Workflow STRICT

**Déclenchement** : Push sur branche `main`

**Validations** :
- ✅ Lint (tous les projets)
- ✅ Test (tous les projets)
- ✅ Build (tous les projets)

**Contenu** :

```yaml
name: CI Main (Strict)

on:
  push:
    branches:
      - main

permissions:
  actions: read
  contents: read

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci --legacy-peer-deps

      # Vérifie TOUT : lint + test + build
      - run: npx nx run-many -t lint test build

      # Fix CI si échec
      - run: npx nx fix-ci
        if: always()
```

---

### ✅ `.github/workflows/pr.yml` - Workflow SOUPLE

**Déclenchement** : Pull Request (toutes branches)

**Validations** :
- ✅ Build (projets affectés uniquement)
- ❌ Pas de lint
- ❌ Pas de test

**Contenu** :

```yaml
name: CI Pull Request (Souple)

on:
  pull_request:

permissions:
  actions: read
  contents: read

jobs:
  pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci --legacy-peer-deps

      # Vérifie SEULEMENT que ça compile (pas lint ni test)
      - run: npx nx affected -t build --base=origin/main

      # Fix CI si échec
      - run: npx nx fix-ci
        if: always()
```

---

## 📊 Comparaison des Workflows

| Critère | CI Main (Strict) | CI Pull Request (Souple) |
|---------|------------------|--------------------------|
| **Déclenchement** | Push sur `main` | Pull Request |
| **Lint** | ✅ Oui (tous) | ❌ Non |
| **Test** | ✅ Oui (tous) | ❌ Non |
| **Build** | ✅ Oui (tous) | ✅ Oui (affectés) |
| **Nx Affected** | ❌ Non | ✅ Oui |
| **Durée estimée** | 🐢 Complète | ⚡ Rapide |
| **Objectif** | Validation totale | Vérification compilation |

---

## 🔄 Flux de Travail

### Scénario 1 : Travail sur une Feature

```bash
# 1. Créer une branche
git checkout -b feature/add-orders

# 2. Développer et commiter
git add .
git commit -m "feat: add orders feature"

# 3. Push de la branche
git push origin feature/add-orders

# ❌ Aucun workflow ne se déclenche (pas de push main, pas de PR)
```

---

### Scénario 2 : Créer une Pull Request

```bash
# 1. Depuis GitHub, créer une PR feature/add-orders → main

# ✅ Workflow "CI Pull Request (Souple)" se déclenche
# - npm ci
# - nx affected -t build --base=origin/main
# - Build uniquement les projets modifiés
# - ⚡ Rapide (pas de lint ni test)
```

---

### Scénario 3 : Merge sur Main

```bash
# 1. Merge de la PR sur main (via GitHub)

# ✅ Workflow "CI Main (Strict)" se déclenche
# - npm ci
# - nx run-many -t lint test build
# - Vérifie TOUT le workspace
# - 🐢 Complet (lint + test + build)
```

---

## 🎯 Avantages de Cette Configuration

### 1. **Développement Rapide** ⚡

Sur les PR :
- ✅ Build seulement = feedback rapide
- ✅ Nx Affected = build uniquement les projets modifiés
- ✅ Développeur peut itérer rapidement

### 2. **Protection de Main** 🛡️

Sur main :
- ✅ Lint complet = respect des conventions
- ✅ Tests complets = pas de régression
- ✅ Build complet = garantie de déploiement

### 3. **Optimisation des Ressources** 💰

- ✅ PR = Minutes CI économisées (pas de lint/test)
- ✅ Main = Validation complète uniquement quand nécessaire
- ✅ Nx Affected = Build ciblé sur PR

### 4. **Flexibilité** 🔧

- ✅ Équipe peut travailler sans blocage sur PR
- ✅ Main reste protégée
- ✅ Possibilité d'ajouter des checks GitHub (require passing)

---

## 🔒 Protection de Branche Recommandée

### Configuration GitHub (Settings → Branches → main)

```
Branch protection rules:
  ✅ Require a pull request before merging
  ✅ Require status checks to pass before merging
     - CI Pull Request (Souple)
  ✅ Require branches to be up to date before merging
  ❌ Do not include administrators (optionnel)
```

---

## 🧪 Test des Workflows

### Test 1 : Workflow PR

```bash
# 1. Créer une branche de test
git checkout -b test/pr-workflow

# 2. Modifier un fichier
echo "// test" >> apps/mini-crm/src/app/app.component.ts

# 3. Commiter et pusher
git add .
git commit -m "test: trigger PR workflow"
git push origin test/pr-workflow

# 4. Créer une PR sur GitHub
# ✅ Vérifier que "CI Pull Request (Souple)" se déclenche
# ✅ Vérifier qu'il build seulement
```

### Test 2 : Workflow Main

```bash
# 1. Depuis une branche, créer une PR
# 2. Merger la PR sur main
# ✅ Vérifier que "CI Main (Strict)" se déclenche
# ✅ Vérifier qu'il lint + test + build
```

---

## 📋 Checklist de Vérification

- [x] Fichier `.github/workflows/ci.yml` modifié
- [x] Fichier `.github/workflows/pr.yml` créé
- [x] Workflow Main : déclenchement sur push main
- [x] Workflow Main : lint + test + build
- [x] Workflow PR : déclenchement sur pull_request
- [x] Workflow PR : build seulement (affected)
- [x] Les deux workflows utilisent Node 20
- [x] Les deux workflows utilisent `npm ci --legacy-peer-deps`
- [x] Les deux workflows ont `npx nx fix-ci`

---

## 🚀 Commandes Git pour Commit/Push

Les fichiers sont prêts. Voici les commandes exactes pour commit et push :

```bash
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter les workflows
git add .github/workflows/ci.yml
git add .github/workflows/pr.yml

# 3. Commiter
git commit -m "ci: configure separate workflows for main (strict) and PR (souple)"

# 4. Pusher sur la branche actuelle
git push origin <votre-branche>

# OU si vous êtes sur main et voulez pusher directement
git push origin main
```

---

## 📊 Temps d'Exécution Estimé

### CI Main (Strict)

| Étape | Durée |
|-------|-------|
| Checkout | ~10s |
| Setup Node | ~20s |
| npm ci | ~60s |
| Lint | ~30s |
| Test | ~45s |
| Build | ~90s |
| **TOTAL** | **~4min** |

### CI Pull Request (Souple)

| Étape | Durée |
|-------|-------|
| Checkout | ~10s |
| Setup Node | ~20s |
| npm ci | ~60s |
| Build (affected) | ~30s |
| **TOTAL** | **~2min** |

⚡ **Gain de temps sur PR : ~50%**

---

## 🔧 Extensions Possibles

### 1. Ajouter Cache Nx

```yaml
- uses: actions/cache@v4
  with:
    path: .nx/cache
    key: nx-${{ hashFiles('**/package-lock.json') }}
```

### 2. Ajouter Matrix Strategy (Multi-version Node)

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### 3. Ajouter Lighthouse CI sur Main

```yaml
# Dans ci.yml
- name: Run Lighthouse CI
  run: npm run lighthouse:app
```

### 4. Ajouter SonarCloud

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## ✅ Conclusion

**Les workflows GitHub Actions sont maintenant configurés !** 🎉

Tu disposes de :
- ✅ **CI Main (Strict)** : lint + test + build sur push main
- ✅ **CI Pull Request (Souple)** : build only sur PR
- ✅ **Nx Affected** : optimisation sur PR
- ✅ **Fix CI automatique** : self-healing CI

**Prochaines étapes** :
1. Commiter et pusher les fichiers
2. Créer une PR de test pour vérifier
3. Configurer les branch protection rules sur GitHub

---

**Configuration effectuée par : Agent Architecte Nx** 🎯  
**Date : 30 Novembre 2025**

