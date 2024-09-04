const ItemModel = require("../models/item.model");

module.exports = {
  getAll: async ({
    filterOptions,
    sortField,
    sortOrder,
    pageOffset,
    pageSize,
  }) => {
    const query = { isDeleted: false };

    // "contains" filter logic

    Object.entries(filterOptions).forEach(([key, value]) => {
      // TODO: Examine this logic and refactor if necessary
      if (key === "minPrice" || key === "maxPrice") {
        query["price"] = query["price"] || {};
        query["price"][key === "minPrice" ? "$gte" : "$lte"] =
          parseFloat(value);
        return;
      }

      if (!isNaN(value)) {
        query[key] = value;
        return;
      }

      query[key] = { $regex: value, $options: "i" };
    });

    const items = await ItemModel.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(pageOffset)
      .limit(pageSize);

    // Get the total count of documents matching the query (for pagination)
    const totalCount = await ItemModel.countDocuments({
      ...query,
      isDeleted: false,
    });

    return { items, totalCount };
  },

  getByValueWithKey: async (key, value) => {
    const item = await ItemModel.findOne({ [key]: value, isDeleted: false });
    return item;
  },

  create: async (data = {}) => {
    const { name, type, category, price } = data;
    const item = new ItemModel({
      name,
      type,
      category,
      price,
    });
    return item.save();
  },

  update: async (id, data = {}) => {
    const item = await ItemModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
          updated_at: Date.now(),
        },
      },
      { new: false }
    );
    return item;
  },

  softDelete: async (id) => {
    const item = await ItemModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, updated_at: Date.now() } },
      { new: false }
    );
    return item;
  },
};
