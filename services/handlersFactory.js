const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`document not found with id of ${id}`, 404));
    }
    await document.deleteOne(); // Trigger "delete" event for reviewModel
    res
      .status(200)
      .json({ success: true, message: `This ${id} Deleted successfully` });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`document not found with id of ${req.params.id}`, 404)
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const existingDocumentName = await Model.findOne({ name: req.body.name });
    const existingDocumentTitle = await Model.findOne({
      title: req.body.title,
    });
    if (existingDocumentName || existingDocumentTitle) {
      return next(new ApiError("Document already exists with this name", 400));
    }
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: newDocument,
    });
  });

exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`document not found with id of ${id}`, 404));
    }
    res.status(200).json({ success: true, data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();

    // Build query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .paginate(countDocuments)
      .sort()
      .fieldLimiting()
      .search(modelName);
    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
