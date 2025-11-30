import nx from '@nx/eslint-plugin';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // L'app peut importer features, data-access et ui
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:data-access',
                'type:ui',
              ],
            },
            // Les features : data-access et ui (PAS d'autres features !)
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:ui'],
            },
            // ui peut importer data-access
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:data-access'],
            },
            // data-access ne peut rien importer
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    plugins: {
      sonarjs,
    },
    rules: {
      // 🎯 SonarJS - Règles Critiques (Bugs & Vulnérabilités)
      'sonarjs/no-all-duplicated-branches': 'error',        // Éviter conditions identiques
      'sonarjs/no-element-overwrite': 'error',              // Éviter écrasement de variables
      'sonarjs/no-identical-conditions': 'error',           // Conditions identiques
      'sonarjs/no-use-of-empty-return-value': 'error',      // Utilisation de retour void
      'sonarjs/no-collection-size-mischeck': 'error',       // Vérification taille collection
    },
  },
];
