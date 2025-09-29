import Joi from 'joi';

export const validateCourse = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).required(),
    thumbnail: Joi.string().uri().optional(),
    isPublished: Joi.boolean().optional()
  });

  return schema.validate(data);
};

export const validateModule = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().optional(),
    order: Joi.number().min(1).required()
  });

  return schema.validate(data);
};

export const validateLesson = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().optional(),
    type: Joi.string().valid('video', 'text').required(),
    content: Joi.string().when('type', {
      is: 'text',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    youtubeVideoId: Joi.string().when('type', {
      is: 'video',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    duration: Joi.number().min(0).optional(),
    order: Joi.number().min(1).required()
  });

  return schema.validate(data);
};