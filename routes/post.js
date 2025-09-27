const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const userController = require("../controllers/postController ");

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

const sendValidationResults = (req, res, next) => {
  const validations = validationResult(req);
  if (!validations.isEmpty()) {
    res.status(400).json({
      errors: validations.array(),
    });
  }
  next();
};

router.use(
  "/:id",
  param("id").isNumeric().withMessage("Post Id should be a number"),
  sendValidationResults
);

router.get("/:id", userController.getPost);

router.post("/", userController.createPost);

router.put("/:id", userController.updatePost);

router.delete("/:id", userController.deletePost);

router.get("/", userController.getPosts);

module.exports = router;
