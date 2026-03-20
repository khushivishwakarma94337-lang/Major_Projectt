const Joi = require("joi");
const joi=require("joi");
const ListingSchema=Joi.object({
    Listing:joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required(),
        country:Joi.string().required().min(0),
        image:Joi.string().allow("",null)

    }).required()
});
module.exports=ListingSchema;

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required()
})
module.exports