import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MemoryRouter } from 'react-router-dom';

const mongoUrl =
	process.env.MONGO_URL || 'mongodb://localhost/project-mongo-wk19';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//From Daniel live 16/5

const TechnigoMemberSchema = new mongoose.Schema({
	name: {
		//Most important
		type: String,
		required: true,
		unique: true,
		enum: [
			'Lovisa',
			'Marianne',
			'Emma',
			'Suki',
			'Anki',
			'Tiina',
			'Kristiina',
			'Dorothea',
			'Mimmi',
		],
	},
	description: {
		type: String,
		minlength: 5,
		maxlength: 140,
		//deletes whitespace from beginning and end of string
		trim: true,
	},
	score: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Number,
		default: Date.now,
	},
});

{
	/* <Button onClick={handleClick()} />; */
}

const TechnigoMember = mongoose.model('TechnigoMember', TechnigoMemberSchema);

//POST requests v1 INDUSTRY STANDARD
app.post('/members', async (req, res) => {
	const { name, description } = req.body;
	try {
		const newMember = await new TechnigoMember({
			name: name,
			description: description,
		}).save();
		res.status(200).json({ response: newMember, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

//POST v2 w promises
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;
// 	console.log(req.body);

// 	new TechnigoMember({ name: name, description: description })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// POST v 3 kommer inte funka utan att kommentera ut V1 2. Mongoose specific
// app.post('/members', (req, res) => {
// 	const { name, description } = req.body;
// 	new TechnigoMember({ name: name, description: description }).save(
// 		(error, data) => {
// 			if (error) {
// 				res.status(400).json({ response: error, success: false });
// 			} else {
// 				res.status(201).json({ response: data, success: true });
// 			}
// 		}
// 	);
// });

// POST -> creating
// PUT -> replaces
// PATCH -> changes

app.post('/members/:id/score', async (req, res) => {
	const { id } = req.params;
	try {
		const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {
			$inc: { score: 1 },
		});
		res.status(200).json({ response: memberToUpdate, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Hello Technigo!');
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
