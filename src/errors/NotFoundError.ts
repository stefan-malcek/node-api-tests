export class NotFoundError extends Error {
  constructor(entity: string, id: any) {
    super(`Entity ${entity} (${id}) was not found.`);
  }
}
