import { QueryStringParameters } from '../..';
import { MEMBER_SUCCESS } from '../../constants/response';

export type SuccessReturn = { success: { message: string } };
export type ErrorReturn = { error?: { message: string } };

async function member({
  uuid,
  queryStringParameters,
}: {
  uuid: string;
  queryStringParameters: QueryStringParameters;
}): Promise<SuccessReturn | ErrorReturn> {
  console.log('uuid,: ', uuid);
  console.log('queryStringParameters,: ', queryStringParameters);

  return { success: { message: MEMBER_SUCCESS } };
}

export { member };
