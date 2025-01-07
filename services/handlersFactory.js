const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { default: slugify } = require("slugify");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`document not found with id of ${id}`, 404));
    }
    res.status(200).json({ message: "Deleted successfully" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = slugify(req.body.name);
    }
    const document = await Model.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`document not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create({
      ...req.body,
      slug: slugify(req.body.name),
    });
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`document not found with id of ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(
      Model.find(req.filteredObject),
      req.query
    )
      .filter()
      .paginate(countDocuments)
      .sort()
      .fieldLimiting()
      .search(modelName);
    // Execute the query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
