export class NotFoundError extends Error {
  constructor(resource: string, id: any) {
    super(`Resource '${resource}' (${id}) was not found.`);
  }
}
