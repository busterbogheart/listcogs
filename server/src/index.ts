import express from 'express'
import cors from 'cors'
import mongo from 'mongodb'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('*', (req, res) => {
	res.status(404).send('HIIIIIIII');
});


(async()=>{
	try {
		const db = new mongo.MongoClient(`mongodb+srv://kempet01:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}/admin?authSource=admin&replicaSet=atlas-8104zh-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`);
		await db.connect();
		app.listen(8000, () => {
			console.log('server up');
		})
	} catch(e){
		console.error(e);
		process.exit();
	}
	
})()

