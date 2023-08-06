import { type HandlerContext, type HandlerEvent } from '../../index';

type AuthorisedResponseParams = {
  event: HandlerEvent;
  context: HandlerContext;
};

function authorisedResponse({ event, context }: AuthorisedResponseParams) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      flag: 'member',
      event,
      context,
    }),
  };
}

export { authorisedResponse };
