//group by status and count how many books each status has
db.books.aggregate([
  {
    $group: {
      _id: "$status",
      number_Of_Books: { $sum: 1 },
    },
  },
]);

//find all published books
//get all categories from this books (no duplicate)
//cpunt
db.books.aggregate([
  {
    $match: { status: "PUBLISH" },
  },
  {
    $unwind: "$categories",
  },
  {
    $match: { categories: { $ne: "" } },
  },
  {
    $group: {
      _id: "$categories",
      all_Books: { $addToSet: "$categories" },
    },
  },
  {
    $project: {
      catLength: { $size: "$all_Books" },
    },
  },
]);
