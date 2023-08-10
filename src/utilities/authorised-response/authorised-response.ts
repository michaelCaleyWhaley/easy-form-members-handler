type AuthorisedResponseParams = {
  body: unknown;
};

function authorisedResponse({ body }: AuthorisedResponseParams) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

export { authorisedResponse };
