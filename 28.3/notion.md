# MONGODB

## Commands in \_MONGOSH

### show dbs

- this command show all the databases in the server

### use

- if the DB does not exist, it will create it and enter it
- if the DB exists, it will switch to that DB
- if we created the DB the new DB will save in the server only when we create a collection

### db.dropDatabase()

- this command will delete the DB
- you must enter to delete it
- the word db in the command is related to the db we are in(like this in JS)

### createCollection('name')

- after we entered a DB we will create a collection

### db.getCollectionNames()

- to see all the collection in the DB we are in
- return an array of strings

### show collections

- this command return the collection names from the DB we are in

### db.collectionName.drop()

- to delete a collection from the DB we are in
- need to know that if there isn't any collection in the DB the Db will be deleted
- this command can not be restored

### db.collectionName.insertone({...})

- to insert a document in the collection
- example: `db.users.insertone({{'name':'kenny', 'enail':'kenny@gmail.com', 'password':'1234567#A'}})`

### db.collectionName.insertmany([{...},{...}])

- to insert many documents in the collection
- example: `db.users.insertMany([{'name':'kenny', 'email':'kenny@gmail.com'},{'name':'bobby', 'email':'bobby@gmail.com', 'password':'1234321'}])`

### db.collectionName.updateOne({...},{$set(...)})

- to update a document in the collection with id.
- can be changed with any other document but it will take the first one found
- you must add $set because if not it will delete the old one and insert the new one
- example:`db.users.updateOne({_id:ObjectId("624198a81cf4099191f54ce8")}, {$set:{name:"Kenny"}})`

### db.collectionName.updateMany({...},{$set(...)})

- update many documents in the collection.
- if the document is not found it will create it

### $set

- in update we need to use $set to update and add to the document

### $unset

- to delete a field from the document
- example: `db.users.updateOne({name:'Jorj'}, {$unset:{'gender':"", 'email':""}})`

### db.collectionName.deleteOne/deleteMany

- delete the document
- One - first one found
- Many - all the found ones
- example: `db.users.deleteOne({name:'Jorge'})`
- example: `db.users.deleteMany({name:'Jorge'})`

### query

-https://www.mongodb.com/docs/manual/reference/operator/query/

### db.collectionName.find({...})

- https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
- find all the documents that match the query
- if you want to find one document you can use find
- `db.books.find({field:value})`

### $lt, $lte

- lt - lower than
- lte - lower than or equal to
- `db.books.find({field:{$lt:value}})`

### $gt, $gte

- gt - greater than
- gte - greater than or equal to
- `db.books.find({field:{$gt:value}})`

### $ne

- ne - not equal to
- `db.books.find({field:{$ne:value}})`

### $in, $nin

- in - search if the value is in the array of values
- `db.books.find({field:{$in:[value1,value2,...]}})`

- nin - search if the value is not in the array of values
- `db.books.find({field:{$notIn:[value1,value2,...]}})`

### $and, $or

- and - search if all the values are in the array of values
- `db.books.find({$and:[{field1:value1},{field2:value2}]})`
- or - search if any of the values are in the array of values
- `db.books.find({$or:[{field1:value1},{field2:value2}]})`
- all books with status published and pageCount lower then 400
  `db.books.find({$and:[{status:'PUBLISH'},{pageCount:{$lt:400}}]})`

### $nor

- nor - search if none of the values are in the array of values
- `db.books.find({$nor:[{$and:[{ pageCount:{$lt:400}},{status:"PUBLISH"}]}]});`

### projection

- what fields to show
- to show = 1
- to hide = 0
- `db.collectionName.find({condition},{projection})`
- `db.collectionName.find({...},{\_id:0,field:1})`

### limit

- to limit the amount items show
- `db.collectionName.find({...},{...}).limit(number)`

### skip

- to skip the first number of items
- `db.collectionName.find({...},{...}).skip(number)`

### regex

- show all the documents that match the regex

- `db.collectionName.find({title:/^a/i},{...})`
  - show all the names that start with a
  - / - start and end the regex

### objects

- reach to the nested objects
- `db.collectionName.find({"object.field :value"})`

### arrays

- to search inside an array

  - when we want to search the only the specific value in an arrays

    - `db.collectionName.find({array:["value1","value2"]})`

  - works as or (one of the values needs to be in the array)
    - we will use $all to see all the values that fits what we are looking for
    - `db.collectionName.find({array:{$in:["value1","value2"]}})`
  - works as and (all the values need to be in the array)
    - `db.collectionName.find({array:{$all:["value1","value2"]}})`

### $countDocuments

- count the number of documents that match the query
- `db.collectionName.countDocuments({...})`

### and plus or example

```js
db.companies.countDocuments({
  $or: [
    {
      $and: [
        { number_of_employees: { $gte: 50 } },
        { number_of_employees: { $lte: 100 } },
      ],
    },
    {
      $and: [
        { number_of_employees: { $gte: 150 } },
        { number_of_employees: { $lte: 200 } },
      ],
    },
  ],
});
```

### Aggregate

#### group

- divide the data into smaller groups
  - sum min, max, avg...
  - https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/

```js
//group by status and count how many books each status has
db.books.aggregate([
  {
    $group: {
      _id: "$status", //field to group by
      //name of the new field
      number_Of_Books: { $sum: "$pageCount" }, //add one to each group
    },
  },
]);
```

#### match

- **in aggregate we cant do a find, we can only do a match**

- filter out books with 0 pageCount
- group by status and count how many books each status has

```js
db.books.aggregate([
  {
    $match: {
      pageCount: { $gt: 0 },
    },
  }
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
]);
```

#### sort

- sort the results by a field
- used with 1 or -1
  - 1: ascending
  - -1: descending

```js
db.books.aggregate([
  {
    $match: {
      pageCount: { $gt: 0 },
    },
  }
  {
    $group: {
      _id: "$status",
      number_of_books: { $sum: 1 },
      avg_books_pages: { $avg: "$pageCount" },
      total_pages: { $sum: "$pageCount" },
      min_pages: { $min: "$pageCount" },
      max_pages: { $max: "$pageCount" },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]);
```

#### project

- show only the fields that we want

  - `concat` = to join two fields
    - `toUpper` = toUpperCase the field
    - `substrCP:[from where to take, where to start, how much to move forward]` = toUpperCase the field and take the letters we want
    - `strlenCP:string value` = show the amount of letters in the field
    - `subtract:[the value we subtract, how much we want]` = subtract the field from the other field
  - `convert:{input, what to convert to, onError(optional), onNull(optional)}`- this command is used to convert the field to a chosen type
    - https://www.mongodb.com/docs/manual/reference/operator/aggregation/convert/

- concat the first name and the last name and upper case only the first letter

```javaScript
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullname: {
        $concat: [
          { $toUpper: { $substrCP: ["$firstname", 0, 1] } },
          {
            $substrCP: [
              "$firstname",
              1,
              {
                $subtract: [{ $strLenCP: "$firstname" }, 1],
              },
            ],
          },
          " ",
          { $toUpper: { $substrCP: ["$lastname", 0, 1] } },
          {
            $substrCP: [
              "$lastname",
              1,
              {
                $subtract: [{ $strLenCP: "$lastname" }, 1],
              },
            ],
          },
        ],
      },
      email: 1,
    },
  },
]);
```

#### unwind

- distract the array into multiple documents
- `$push` = put all the values in the array into a new field (with doubles)
- `$addToSet` = add the value to the array if it is not already in the array
- `$size` = show the amount of items in the array
- `$slice:[from what array, where to start, how much]` = show the items in the array in a chosen range

#### year

- pulling a year from a date

#### out

- create new collection from the results
- `$out:name of the new collection`
- https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/
