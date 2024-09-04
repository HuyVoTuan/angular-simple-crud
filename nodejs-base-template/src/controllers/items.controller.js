// Services
const ItemService = require("../services/items.service");

module.exports = {
  createItem: async (req, res) => {
    const { name, type, category, price } = req.body;

    // check name existance
    const item = await ItemService.getByValueWithKey("name", name);
    if (item) {
      return res.status(409).json({
        isSucess: false,
        statusCode: 409,
        message: "Item already exists. Insert operation not performed!",
      });
    }

    // create a new item
    const payload = {
      name,
      type,
      category,
      price,
    };

    try {
      await ItemService.create(payload);
      res.status(201).json({
        isSucess: true,
        statusCode: 201,
        msg: "Create new item successfully.",
      });
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        isSucess: false,
        msg: `[Error] ${err}!`,
      });
    }
  },

  getItems: async (req, res) => {
    const {
      pageIndex = 1,
      pageSize = 10,
      sortField = "created_at",
      sortOrder = "desc",
      filter = "",
    } = req.query;

    // Parse query params
    const parsedPageIndex = parseInt(pageIndex);
    const parsedPageSize = parseInt(pageSize);
    const parsedSortOrder = sortOrder === "asc" ? 1 : -1;

    // Calculate skip value for pagination
    const pageOffset = (parsedPageIndex - 1) * parsedPageSize;

    // Parse filter if provided
    const filterOptions = filter ? JSON.parse(filter) : {};

    const baseResponse = {
      pageIndex: parsedPageIndex,
      pageSize: parsedPageSize,
      isSuccess: true,
    };

    try {
      // Get searched, sorted, and paginated items from the service
      const { items, totalCount } = await ItemService.getAll({
        filterOptions: filterOptions,
        sortField: sortField,
        sortOrder: parsedSortOrder,
        pageOffset: pageOffset,
        pageSize: parsedPageSize,
      });

      if (totalCount === 0) {
        return res.status(200).json({
          isSucess: true,
          statusCode: 200,
          msg: "Retrieve items successfully.",
          ...baseResponse,
          dataLength: 0,
          totalPages: 0,
          data: [],
        });
      }

      res.status(200).json({
        isSucess: true,
        statusCode: 200,
        msg: "Retrieve items successfully.",
        ...baseResponse,
        dataLength: totalCount,
        totalPages: Math.ceil(totalCount / parsedPageSize),
        data: items,
      });
    } catch (err) {
      res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        msg: `[Error] ${err}!`,
      });
    }
  },

  getItem: async (req, res) => {
    const id = req.params.id;

    try {
      const item = await ItemService.getByValueWithKey("_id", id);

      if (!item) {
        return res.status(400).json({
          isSucess: false,
          statusCode: 400,
          msg: `Item not found!`,
        });
      }

      res.status(200).json({
        isSucess: true,
        statusCode: 200,
        msg: "Retrieve item successfully.",
        data: item,
      });
    } catch (err) {
      res.status(400).json({
        isSucess: false,
        statusCode: 400,
        msg: `[Error] ${err}!`,
      });
    }
  },

  updateItem: async (req, res) => {
    const id = req.params.id;

    const payload = {};
    const itemKeys = ["name", "type", "category", "price"];
    itemKeys.forEach((key) => {
      if (req.body.hasOwnProperty(key)) payload[key] = req.body[key];
    });

    if (!payload.type || !payload.category) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "Type and category are required.",
      });
    }

    // check if item already exists with the same name, type, and category
    const { items } = await ItemService.getAll({
      filterOptions: {},
    });

    const isItemExists = items.some((item) => {
      return (
        item.name === payload.name &&
        item.type === payload.type &&
        item.category === payload.category
      );
    });

    if (isItemExists) {
      return res.status(409).json({
        isSuccess: false, // Use camelCase for consistency
        statusCode: 409,
        message: "Item already exists with the same name, type, and category.",
      });
    }

    try {
      const updatedItem = await ItemService.update(id, payload);

      if (!updatedItem) {
        return res.status(400).json({
          isSucess: false,
          statusCode: 400,
          data: "Item not found!",
        });
      }

      res.status(204).json({
        isSucess: true,
        statusCode: 204,
        msg: "Update item successfully.",
      });
    } catch (err) {
      res.status(400).json({
        isSucess: false,
        statusCode: 400,
        msg: `[Error] ${err}!`,
      });
    }
  },

  softDeleteItem: async (req, res) => {
    const id = req.params.id;

    try {
      const item = await ItemService.softDelete(id);

      if (!item || item.isDeleted) {
        return res.status(400).json({
          isSucess: false,
          statusCode: 400,
          msg: "Item not found!",
        });
      }

      res.status(204).json({
        isSucess: true,
        statusCode: 204,
        msg: "Delete item successfully.",
      });
    } catch (err) {
      res.status(500).json({
        isSucess: false,
        statusCode: 500,
        msg: `[Error] ${err}`,
      });
    }
  },
};
