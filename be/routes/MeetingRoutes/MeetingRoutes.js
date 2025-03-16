const {
  getMeeting,
  detailMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} = require("../../controllers/MeetingController/MeetingController.js");
const VerifyUser = require("../../middleware/VerifyUser.js");
const {
  createMeetingVal,
  updateMeetingVal,
} = require("../../validation/meetingValidation/MeetingValidation.js");
let router = require("express").Router();

router.get("/meeting", VerifyUser, getMeeting);
router.get("/meeting/:id", VerifyUser, detailMeeting);
router.post("/meeting", VerifyUser, createMeetingVal, createMeeting);
router.patch("/meeting/:id", VerifyUser, updateMeetingVal, updateMeeting);
router.delete("/meeting/:id", VerifyUser, deleteMeeting);

module.exports = router;
