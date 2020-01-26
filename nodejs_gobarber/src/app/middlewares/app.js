export default async (req, res, next) => {
  req.vars = {};
  return next();
};
