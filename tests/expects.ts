import * as StatusCode from '../src/StatusCode';
import { BusinessError } from '../src/errors';

export const expectSnapshotOk = (response: any) => {
    expect(response.body).toMatchSnapshot();
    expect(response.status).toBe(StatusCode.Ok);
};

export const expectItemsCountOk = (response: any, itemsCount) => {
    expect(response.status).toBe(StatusCode.Ok);
    expect(response.body.metadata.totalItems).toBe(itemsCount);
};

export const expectBadRequest = (response: any, error: BusinessError) => {
    expect(response.status).toBe(StatusCode.BadRequest);
    expect(response.body.name).toBe(error.name);
};

export const expectUnauthorized = (response: any) => {
    expect(response.status).toBe(StatusCode.Unauthorized);
};

export const expectForbidden = (response: any) => {
    expect(response.status).toBe(StatusCode.Forbidden);
};

export const expectNotFound = (response: any) => {
    expect(response.status).toBe(StatusCode.NotFound);
};

