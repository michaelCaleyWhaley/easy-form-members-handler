function unauthorisedResponse(message: { error?: { message: string } }) {
  return {
    statusCode: 401,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  };
}

export { unauthorisedResponse };
