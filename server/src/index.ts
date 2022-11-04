import express from 'express'
import cors from 'cors'
import mongo from 'mongodb'
import dotenv from 'dotenv'
import discogs from 'disconnect'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('*', (req, res) => {
	res.status(200).send('HIIIIIIII');
});


(async()=>{
	try {
		const db = new mongo.MongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/admin?authSource=admin&replicaSet=atlas-8104zh-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`);
		await db.connect();
		app.listen(8000, () => {
			console.log('server up');
		})
		
		const d = new discogs.Client();
		const discogsDb = d.database();
		const discogsUser = d.user();
		const USER = 'classicalonvinyl'
		
		//any user's public collection, no auth required
		//const res = await discogsUser.collection().getReleases(USER, 0);
		
		//any user's public list, no auth required
		//const opt:discogs.PaginationOpts = {}
		//const res = await discogsUser.getLists('KingKubrick', opt)
		
		//any user's public wantlist, no auth required
		//const res = await discogsUser.wantlist().getReleases(USER);
		
		//no auth required
		//const res = await discogsDb.getRelease(176126);
		//console.log(res)
		
	} catch(e){
		console.error(e);
		process.exit();
	}
	
})()

