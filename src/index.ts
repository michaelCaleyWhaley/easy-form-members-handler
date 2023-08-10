import { UNAUTHORISED_ORIGIN_OR_PATH } from './constants/response';
import { member } from './controllers/member';
import { ErrorReturn, SuccessReturn } from './controllers/member/member';
import { authorisedResponse } from './utilities/authorised-response';
import { unauthorisedResponse } from './utilities/unauthorised-response';

export type QueryStringParameters = { [key: string]: string };
export type HandlerEvent = {
  path: string;
  queryStringParameters?: QueryStringParameters;
  requestContext?: { authorizer: { claims: { sub: string; email: string } } };
};
export type HandlerContext = unknown;
type Controllers = {
  [key: string]: (args: {
    uuid?: string;
    userEmail?: string;
    queryStringParameters?: QueryStringParameters;
  }) => Promise<SuccessReturn | ErrorReturn>;
};

const controllers: Controllers = { '/members': member };

export const handler = async (
  event: HandlerEvent,
): Promise<{
  statusCode: number;
  headers: { [key: string]: string };
  body: unknown;
}> => {
  const { path, queryStringParameters, requestContext } = event;
  const { sub: uuid, email: userEmail } =
    requestContext?.authorizer?.claims || {};

  if (!controllers[path])
    return unauthorisedResponse({
      error: { message: UNAUTHORISED_ORIGIN_OR_PATH },
    });

  const controllerResponse = await controllers[path]({
    uuid,
    userEmail,
    queryStringParameters,
  });

  if (typeof controllerResponse === 'object' && 'error' in controllerResponse) {
    return unauthorisedResponse(controllerResponse);
  }

  const {
    success: { body },
  } = controllerResponse as SuccessReturn;

  return authorisedResponse({ body });
};
