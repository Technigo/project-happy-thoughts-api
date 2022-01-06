import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const MemberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian'],
	},
	description: {
		type: String,
		minlength: 5,
		maxlength: 10,
		trim: true,
	},
	score: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Number,
		default: () => Date.now(),
	},
});

const Member = mongoose.model('Member', MemberSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/members', async (req, res) => {
	const {
		sort,
		page,
		perPage,
		sortNum = Number(sort),
		pageNum = Number(page),
		perPageNum = Number(perPage),
	} = req.query;

	// v1 - Mongoose
	// const members = await Member.find({})
	// .sort({ createdAt: sortNum })
	// .skip((pageNum - 1) * perPageNum)
	// .limit(perPageNum);

	// v2 - Mongo
	const members = await Member.aggregate([
		{
			$sort: {
				createdAt: sortNum,
			},
		},
		{
			$skip: (pageNum - 1) * perPageNum,
		},
		{
			$limit: perPageNum,
		},
	]);

	res.status(200).json({ response: members, success: true });
});

// v1 - async await
app.post('/members', async (req, res) => {
	const { name, description } = req.body;

	try {
		const newMember = await new Member({ name, description }).save();
		res.status(201).json({ response: newMember, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// v2 - promises
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;

// 	new Member({ name, description })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// v3 - mongoose callback
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;

// 	new Member({ name, description }).save((error, data) => {
// 		if (error) {
// 			res.status(400).json({ response: error, success: false });
// 		} else {
// 			res.status(201).json({ response: data, success: true });
// 		}
// 	});
// });

app.post('/members/:id/score', async (req, res) => {
	const { id } = req.params;

	try {
		const updatedMember = await Member.findByIdAndUpdate(
			// Argument 1 - id
			id,
			// Argument 2 - properties to change
			{
				$inc: {
					score: 1,
				},
			},
			// Argument 3 - options (not mandatory)
			{
				new: true,
			}
		);
		res.status(200).json({ response: updatedMember, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

app.delete('/members/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const deletedMember = await Member.findOneAndDelete({ _id: id });
		if (deletedMember) {
			res.status(200).json({ response: deletedMember, success: true });
		} else {
			res.status(404).json({ response: 'Member not found', success: false });
		}
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

app.patch('/members/:id', async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	// v1 - async / await
	try {
		const updatedMember = await Member.findOneAndUpdate(
			{ _id: id },
			{ name },
			{ new: true }
		);
		if (updatedMember) {
			res.status(200).json({ response: updatedMember, success: true });
		} else {
			res.status(404).json({ response: 'Member not found', success: false });
		}
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}

	// v2 - Promises
	// Member.findOneAndUpdate({ _id: id }, { name }, { new: true })
	// 	.then((updatedMember) => {
	// 		if (updatedMember) {
	// 			res.status(200).json({ response: updatedMember, success: true });
	// 		} else {
	// 			res.status(404).json({ response: 'Member not found', success: false });
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		res.status(400).json({ response: error, success: false });
	// 	});
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
