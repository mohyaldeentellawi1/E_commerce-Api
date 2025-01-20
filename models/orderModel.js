const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        color: {
          type: String,
        },
        totalItemPrice: {
          type: Number,
        },
      },
    ],
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingAddress: {
      details: {
        type: String,
        required: [true, "Please provide your address"],
      },
      phone: {
        type: String,
        required: [true, "Please provide your phone number"],
      },
      city: {
        type: String,
        required: [true, "Please provide your city"],
      },
      postalCode: {
        type: String,
      },
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodeType: {
      type: String,
      enum: ["creditCard", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
