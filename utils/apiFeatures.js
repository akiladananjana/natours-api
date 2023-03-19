class APIFeatures {
  constructor(mongooseQuery, urlQueryString) {
    this.query = mongooseQuery;
    this.queryString = urlQueryString;
  }

  filter() {
    let queryObject = { ...this.queryString };
    const excludeItems = ["sort", "page", "fields", "limit"];

    // REMOVE UNWANTED ITEMS and Manage them manually
    excludeItems.forEach(item => {
      delete queryObject[item];
    });

    const queryStr = JSON.stringify(queryObject);

    //////////// ADVANCED FILTERING //////////
    queryObject = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    // Tour.find() returns a mongoose Query object. If we await the query then
    // It execute and gives the results. Therefore first, We modify it, and
    // finally executes with await keyword.

    // let query = Tour.find(JSON.parse(queryObject));

    this.query = this.query.find(JSON.parse(queryObject));

    return this;
  }

  sort() {
    //////////// SORTING //////////
    if (this.queryString.sort) {
      // to Sort by more than two URL parameters
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limit() {
    //////////// LIMIT FIELDS //////////
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    ////////// PAGINATION //////////
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;

    // If user request more docs that not exists in DB
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
