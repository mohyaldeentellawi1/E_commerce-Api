const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => asyncHandler( async (req,res, next)=>{
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if(!document){
    return next(new ApiError(`document not found with id of ${id}`, 404));
    }
    res.status(200).json({message: 'Deleted successfully'});
    });

exports.updateOne = (Model) => asyncHandler(async (req,res,next)=>{
    const document = await Model.findByIdAndUpdate(req.params.id, req.body ,
    {new:true}); 
    if(!document){
    return next(new ApiError(`document not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
    });    

exports.createOne = (Model) => asyncHandler(async  (req,res) => {
    const newDocument = await  Model.create(req.body);
    res.status(201).json({data: newDocument})   
    });   
    
exports.getOne = (Model) => asyncHandler( async (req,res , next)=> {
    const { id } = req.params;
    const document = await Model.findById(id);
    if(!document){
    return next(new ApiError(`document not found with id of ${id}`, 404));
    } 
    res.status(200).json({data: document});
    });    

exports.getAll = (Model, modelName = '') => asyncHandler( async (req,res) => {
    let filter = {};
    if(req.filterObj) {
        filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .paginate(countDocuments)
        .sort()
        .fieldLimiting()
        .search(modelName);
    // Execute the query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({results:documents.length , paginationResult, data: documents });
    });    