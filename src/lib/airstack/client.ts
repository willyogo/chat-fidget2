import { config } from '../config';

const AIRSTACK_API_ENDPOINT = 'https://api.airstack.xyz/gql';

export async function queryAirstack(query: string, variables: Record<string, any>) {
  console.log('Airstack Query:', { query, variables });

  const response = await fetch(AIRSTACK_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.airstackApiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Airstack API error:', error);
    throw new Error(`Airstack API request failed: ${error}`);
  }

  const json = await response.json();
  console.log('Airstack Response:', json);

  if (json.errors) {
    console.error('Airstack GraphQL errors:', json.errors);
    throw new Error(json.errors[0].message);
  }

  return json;
}