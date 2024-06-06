export default {
  documents: [
    'packages/schema/src/fragments/**/*.{gql,graphql,graphqls}',
    'packages/schema/src/operations/*.{gql,graphql,graphqls}',
    'packages/schema/src/schema.graphql',
  ],
  storage: {
    id: process.env.JIRA_PROJECT_ID,
    token: process.env.DASHBOARD_ACCESS_TOKEN,
    api: 'https://dashboard.amazeelabs.com/api/estimator',
  },
};
