import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
name :{ type: String, required: true },
price_monthly:{ type: Number, },
price_quarterly :{ type: Number, },
price_semi_annually :{ type: Number,  },
price_annually :{ type: Number,  },
website_limit:{ type: Number,  },
}, { timestamps: true });


export const PlanModel = mongoose.model('Plan', PlanSchema);