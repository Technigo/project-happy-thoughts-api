
// const ThoughtsSchema = new mongoose.Schema({
	//in this object specify every single thing about this property(name)
	// name: {
		//adding parameters
		// most impotant one is type
		// type: String,
		// default: "unknown",
		// will require forces to provide this value
		// required: true,
		// new name will have to be different than all others in the database/it should be unique
		// unique: true,
		//to delete the whitespace
		// trim: true
		//enum is handy for final project which is all the allowed values
		// here in enum, only these "five" will be allowd in our database. nothing else rather than we write here is allowed here
		// enum: ["Matilda", "Poya", "Petra", "Hanna", "Daniel"]
	// },
	//can be sth similar to happy thought
	// message: {
	// 	type: String,
	// 	minlength: 5,
	// 	maxlength: 140,
	// 	required: true,
		// trim removes unneccessary white spaces from the begining and from the end of our whole message
		// by default is false and we here change it to true
	// 	trim: true
	// },
	// score will only have 2 properties
	// hearts: {
	// 	type: Number,
		//initil value if none other is specified
	// 	default: 0
	// },
	//createdAt should have Date
	// createdAt: {
	// 	type: Date,
		// new Date() will execute once - when we start the server
		// default: new Date()
		// onClick = { someFunction()}
		// IIFE/immediatly function expression. //in the moment that you declare the function it is called/executed right away
		// (() => new Date())()
		// or it can be like this: (function functionName () {new Date()})()
// 		default: () => new Date()
// 	}
// });
// const Thoughts = mongoose.model("Thoughts", ThoughtsSchema);

// // Start defining your routes here
// app.get("/", (req, res) => {
// 	res.send({ Message: "Hello, Welcome to our Happy Thoughts!", data: listEndpoints(app) });
// });


// app.get("/thoughts", async (req, res) => {
// 	try {
// 		const thoughts = await Thoughts.find().sort({ createdAt: 'desc' }).limit(20).exec();
// 		res.status(200).json(thoughts);
// 	} catch (error) {
// 		res.status(400).json({
// 			success: false,
// 			response: "Bad request, not able to fetch thoughts.",
// 		});
// 	}
// });

// Create a Post handler and using Restful route that should be Post to thoughts
// 3 different ways
//V1/the most universal one is with async await

// app.post("/thoughts", async (req, res) => {
	//Retrieve the information sent by the client to our API endpoint. Send information to the request
	// const { message } = req.body;
	// console.log(req.body);
	// try {
		// Use our mongoose model to create the database entry/create a new thought to Mongo and will send it to the Database
		// const newThoughts = await new Thoughts({ message }).save();
		//Success
	// 	res.status(201).json({ success: true, response: newThoughts });
	// } catch (err) {
		//Bad Request
// 		res.status(400).json({ success: false, response: "Could not save thought to the Database", error: err.errors })
// 	}
// });

// V2 POST with promises

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save()
//       .then(data => {
//         res.status(201).json({success: true, response: data});
//     }).catch(error => {
//         res.status(400).json({success: false, response: error});
//     })
// });

// V3 POST mongoose syntax/just to know more

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//       if(error) {
//         res.status(400).json({success: false, response: error});
//       } else {
//         res.status(201).json({success: true, response: data});
//       } 
//     });
// });

//** To Update with the hearts for project happy thoughts api**

//POST => create stuff
//PUT => replace in DB -> one person switch with another
// PATCH => change/modify stuff

// app.patch("/thoughts/:thoughtId/like", async (req, res) => {
// 	const { thoughtId } = req.params;
// 	try {
// 		const thoughtToUpdateLike = await Thoughts.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } });
// 		res.status(200).json({ success: true, response: `Thoughts ${thoughtToUpdateLike} has their heart updated` });
// 	} catch (error) {
// 		res.status(400).json({ success: false, response: "Could not show the likes for this ID" });
// 	}
// });

///////////////
/// Pagination ///will be handy for final project
// v1 mongoose

// app.get("/members", aync (req, res) => {
// 	const members = await TechnigoMember.find({})
//   const {page, perPage} = req.query;
//   try{
// 		const members = await TechnigoMember.find({}).sort({createdAt: -1})
//    .skip((page - 1) * perPage).limit(perPage)
// 	}
// })

// const paginatedResults = (model) => {
//   return (req, res, next) => {
//     const page = +req.query.page 
//     const limit = +req.query.limit

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}

//     if (endIndex < model.length) {
//       results.next = {
//         page: page + 1,
//         limit: limit
//       }
//     }
//       if (startIndex > 0) {
//       results.previous = {
//         page: page - 1,
//         limit: limit
//       }
//     }

//     results.result

//,,,
////// Thursday /////
/// Pagination ////

// app.get("/members", async (req, res) => {
  // const members = await TechnigoMember.find({});
  /// V1 mongoose ///
  // const {page, perPage} = req.query;
  // try {
  //   const members = await TechnigoMember.find({}).sort({createdAt: -1})
  //     .skip((page - 1) * perPage).limit(perPage);
  // // Items are sorted, so we are always skipping the same, pages do not differ based on variance
  // //  case 1 == page is 1, perPage is 10
  // //  .skip( 1 - 1) == 0; 0*10 == 0 => skip(0) => not skipping anything; 
  // // .limit(10) => we are returning 10 items, not skipping anything, first 10 items are returned; 
  // //  case 2 == page is 2, perPage is 10
  // //  .skip( 2 - 1) == 1; 1*10 == 10 => skip(10) => skipping 10 items == skipping the first page; 
  // // .limit(10) => we are returning 10 items, skipping the first page, second 10 items are returned; 
  // //  case 3 == page is 43, perPage is 10
  // //  .skip( 43 - 1) == 42; 42*10 == 420 => skip(420) => skipping 420 items == skipping the first 420 pages; 
  // // .limit(10) => we are returning 10 items, skipping the first 42 pages,  the 43rd 10 items are returned; 

  //   res.status(200).json({success: true, response: members});
  // } catch (error) {
  //   res.status(400).json({success: false, response: error});
  // }
  // V2 Mongo
//   const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
//   try {
//     const members = await TechnigoMember.aggregate([
//       {
//         $sort: {
//           createdAt: -1
//         }
//       },
//       {
//         $skip: (numberPage - 1) * numberPerPage
//       },
//       {
//         $limit: numberPerPage
//       }
//     ]);
//     res.status(200).json({success: true, response: members});
//   }
//  catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });
// http://localhost:8080/members?page=2&perPage=1
// app.delete("/members/:id", async (req, res) => {
//   const { id } = req.params;
  // Delete removes entry and returns the removed one
  // Remove removes entry and returns true/false
//   try {
//     const deletedMember = await TechnigoMember.findOneAndDelete({_id: id});
//     if (deletedMember) {
//       res.status(200).json({success: true, response: deletedMember});
//     } else {
//       res.status(404).json({success: false, response: "Not found"});
//     }
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });
/// Nesting Schemas
// const TestSchema = new mongoose.Schema({
//   testProperty: {
//     type: String,
//   },
//   secondTestPropery: {
//     type: Number,
//     default: 8
//   }
// });
// const SuperSchema = new mongoose.Schema({
//   superTestProperty: {
//     type: String,
//   },
//   superSecondTestPropery: {
//     type: Number,
//     default: 8
//   },
//   lalalala: {
//     type: TestSchema,
//     required: true
//   }
// });

// const SuperModel = mongoose.model("SuperModel", SuperSchema);
// const superObject = new SuperModel({
//   superTestProperty: "superTestProperty",
//   superSecondTestPropery: 9,
//   lalalala: {
//     testProperty: "testProperty",
//     secondTestPropery: 10
//   }
// });
///////////////
/// Pagination ///will be handy for final project
// v1 mongoose

// app.get("/members", aync (req, res) => {
// 	const members = await TechnigoMember.find({})
//   const {page, perPage} = req.query;
//   try{
// 		const members = await TechnigoMember.find({}).sort({createdAt: -1})
//    .skip((page - 1) * perPage).limit(perPage)
// 	}
// })

// const paginatedResults = (model) => {
//   return (req, res, next) => {
//     const page = +req.query.page 
//     const limit = +req.query.limit

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}

//     if (endIndex < model.length) {
//       results.next = {
//         page: page + 1,
//         limit: limit
//       }
//     }
//       if (startIndex > 0) {
//       results.previous = {
//         page: page - 1,
//         limit: limit
//       }
//     }

//     results.result

////////////
// V2 POST with promises

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save()
//       .then(data => {
//         res.status(201).json({success: true, response: data});
//     }).catch(error => {
//         res.status(400).json({success: false, response: error});
//     })
// });

// V3 POST mongoose syntax/just to know more

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//       if(error) {
//         res.status(400).json({success: false, response: error});
//       } else {
//         res.status(201).json({success: true, response: data});
//       } 
//     });
// });

//** To Update with the hearts for project happy thoughts api**

//POST => create stuff
//PUT => replace in DB -> one person switch with another
// PATCH => change/modify stuff
