
class ApiFeatures{
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObj = {...this.queryString}; // copy the query string object from  reference
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];    
        excludedFields.forEach(field => delete queryStringObj[field]);
        let queryString = JSON.stringify(queryStringObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // add $ sign before gte, gt, lte, lt
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
        return this;
    }

    sort() {
        if(this.queryString.sort){
        // price , -sold => ['price', '-sold'] => price -sold
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
        this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    fieldLimiting() {
        if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' '); 
        this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
        this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search() {
        if(this.queryString.keyword){
        const query = {};
        query.$or = [
        {title: { $regex: this.queryString.keyword, $options: 'i' }},
        {description: { $regex: this.queryString.keyword, $options: 'i' }}
        ];
        this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;    
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;