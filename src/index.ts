import { UNAUTHORISED_ORIGIN_OR_PATH } from './constants/response';
import { member } from './controllers/member';
import { ErrorReturn, SuccessReturn } from './controllers/member/member';
import { authorisedResponse } from './utilities/authorised-response';
import { unauthorisedResponse } from './utilities/unauthorised-response';

export type QueryStringParameters = { [key: string]: string };
export type HandlerEvent = {
  path: string;
  queryStringParameters?: QueryStringParameters;
  requestContext?: { authorizer: { claims: { sub: string } } };
};
export type HandlerContext = unknown;
type Controllers = {
  [key: string]: (args: {
    uuid?: string;
    queryStringParameters?: QueryStringParameters;
  }) => Promise<SuccessReturn | ErrorReturn>;
};

const controllers: Controllers = { '/members': member };

export const handler = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<{
  statusCode: number;
  headers: { [key: string]: string };
  body: unknown;
}> => {
  const { path, queryStringParameters, requestContext } = event;
  const uuid = requestContext?.authorizer?.claims?.sub;

  if (!controllers[path])
    return unauthorisedResponse({
      error: { message: UNAUTHORISED_ORIGIN_OR_PATH },
    });

  const controllerResponse = await controllers[path]({
    uuid: uuid || null,
    queryStringParameters,
  });

  if (typeof controllerResponse === 'object' && 'error' in controllerResponse) {
    return unauthorisedResponse(controllerResponse);
  }

  return authorisedResponse({ event, context });
};
