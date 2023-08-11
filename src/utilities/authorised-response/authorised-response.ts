import { SuccessReturn } from '../../controllers/member/member';

function authorisedResponse(response: SuccessReturn) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response),
  };
}

export { authorisedResponse };
