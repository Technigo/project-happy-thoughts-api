export default class APIRequest {
  constructor(mongoQuery) {
    this.mongoQuery = mongoQuery;
  }

  sort() {
    const sortBy = 'createdAt';
    const orderBy = 'desc';
    this.mongoQuery = this.mongoQuery.sort({ [sortBy]: orderBy });
    return this;
  }

  limit() {
    const limit = 20;
    this.mongoQuery = this.mongoQuery.limit(limit);
    return this;
  }
}
