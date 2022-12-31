var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

//cách làm theo kiểu typescript:
// import express, { Express, Request, Response } from 'express';
// const router = express.Router();

// /* GET users listing. */
// router.get('/', (req: Request, res: Response, next: any) => {
//   res.json({ message: 'Users' });
// });

// export default router;
