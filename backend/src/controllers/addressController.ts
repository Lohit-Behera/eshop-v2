import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import { Address, IAddress } from "../models/addressModel";
import Joi from "joi";

const createAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  // joi schema for validation
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow(""),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    pinCode: Joi.string().required(),
    phone: Joi.string().required(),
    isDefault: Joi.boolean().required(),
  });
  // validate the request body
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const address = await Address.create({
    user: user?._id,
    ...value,
  });

  if (!address) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Failed to create address."));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, null, "Address created successfully."));
});

const getAllAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  const addresses = await Address.find({ user: user?._id }).sort({
    createdAt: -1,
  });
  if (!addresses) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No addresses found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses found successfully."));
});

const getAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.addressId);
  if (!address) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Address not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address found successfully."));
});

interface AddressUpdateRequest {
  name?: string;
  type?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  phone?: number;
  isDefault?: boolean;
}

const updateAddress = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    addressId: Joi.string(),
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    addressLine1: Joi.string().optional(),
    addressLine2: Joi.string().optional().allow(""),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    pinCode: Joi.string().optional(),
    phone: Joi.string().optional(),
    isDefault: Joi.boolean().optional(),
  });
  // validate the request body
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const user = await User.findById(req.user?._id);
  const address = await Address.findById(value.addressId);
  if (!address) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Address not found."));
  }
  if (address.user.toString() !== user?._id.toString()) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          null,
          "You are not authorized to update this address"
        )
      );
  }
  const fieldsToUpdate: (keyof AddressUpdateRequest)[] = [
    "name",
    "type",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "country",
    "pinCode",
    "phone",
    "isDefault",
  ];
  const updates: Partial<IAddress> = {};
  let hasUpdates = false;

  fieldsToUpdate.forEach((field) => {
    if (value[field] !== undefined && value[field] !== address.get(field)) {
      updates[field] = value[field];
      hasUpdates = true;
    }
  });
  if (!hasUpdates) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No updates provided."));
  }
  await address.updateOne(updates);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Address updated successfully."));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  const address = await Address.findById(req.params.addressId);
  if (!address) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Address not found."));
  }
  if (address.user.toString() !== user?._id.toString()) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          null,
          "You are not authorized to delete this address"
        )
      );
  }
  await address.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Address deleted successfully."));
});

export {
  createAddress,
  getAllAddress,
  getAddress,
  updateAddress,
  deleteAddress,
};
