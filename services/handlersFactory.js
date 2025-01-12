const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError").default;
const ApiFeatures = require("../utils/apiFeatures").default;
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
    const slugField =
      Model.modelName === "Product" ? req.body.title : req.body.name;
    if (slugField) {
      updateData.slug = slugify(slugField);
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
    const slugField =
      Model.modelName === "Product" ? req.body.title : req.body.name;
    const newDocument = await Model.create({
      ...req.body,
      slug: slugify(slugField),
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

    // Build query
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .filter()
      .paginate(countDocuments)
      .sort()
      .fieldLimiting()
      .search(modelName)
      .poPulate(modelName);

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
