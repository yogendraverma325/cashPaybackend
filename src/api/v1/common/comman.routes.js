import Express from "express";
import authentication from "../../../middleware/authentication.js";
import commonController from "./common.controller.js";

export default Express.Router()

  .get("/getCalendar", commonController.getCalendar)
  .get("/category", commonController.getCategory)
  .get("/subCategory/:id", commonController.getSubcategory)