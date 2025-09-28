const { Router } = require("express");
const { param, validationResult } = require("express-validator");
const passport = require("passport");

const commentController = require("../controllers/commentController");

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
  param("id").isNumeric().withMessage("Comment Id should be a number"),
  sendValidationResults
);

router.get("/:id", commentController.getComment);

router.post("/", commentController.createComment);

router.put("/:id", commentController.updateComment);

router.delete("/:id", commentController.deleteComment);

router.get("/", commentController.getComments);

module.exports = router;
