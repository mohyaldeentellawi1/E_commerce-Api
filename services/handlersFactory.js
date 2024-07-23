const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

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