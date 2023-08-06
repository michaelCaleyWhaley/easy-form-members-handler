// import { UNAUTHORISED_ORIGIN_OR_PATH } from './constants/response';
// import { member } from './controllers/member';
import { authorisedResponse } from './utilities/authorised-response';
// import { unauthorisedResponse } from './utilities/unauthorised-response';

export type QueryStringParameters = { [key: string]: string };
export type HandlerEvent = {
  path: string;
  queryStringParameters?: QueryStringParameters;
};
export type HandlerContext = unknown;
// type Controllers = {
//   [key: string]: (args: {
//     queryStringParameters?: QueryStringParameters;
//   }) => Promise<string> | undefined | Promise<void>;
// };

// const controllers: Controllers = { '/members': member };

export const handler = async (
  event: HandlerEvent,
  context: HandlerContext,
): Promise<{
  statusCode: number;
  headers: { [key: string]: string };
  body: unknown;
}> => {
  // const { path, queryStringParameters } = event;

  // if (!controllers[path])
  //   return unauthorisedResponse({
  //     error: { message: UNAUTHORISED_ORIGIN_OR_PATH },
  //   });

  // const controllerResponse = await controllers[path]({
  //   queryStringParameters,
  // });

  // if (typeof controllerResponse === 'object' && 'error' in controllerResponse) {
  //   return unauthorisedResponse(controllerResponse);
  // }

  return authorisedResponse({ event, context });
};
