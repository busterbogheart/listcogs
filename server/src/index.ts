import express, {Response} from 'express'
import cors from 'cors'
import mongo, {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import disco, {Client, Database, OAuthCallback, User} from 'disconnect'
import SpotifyWebApi from 'spotify-web-api-node'
import {allowedNodeEnvironmentFlags} from 'process'

dotenv.config();

const app = express();
const discogsKey:string = process.env.DISCOGSKEY as string;
const discogsSecret:string = process.env.DISCOGSSECRET as string;

app.use(cors());
app.use(express.json());

console.log('locals?', app.locals)

const db = new mongo.MongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/admin?authSource=admin&replicaSet=atlas-8104zh-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`);
db.connect().then( (client:mongo.MongoClient) => {
	console.log('db up');
});
app.listen(8000, () => {
	console.log('server up');
});

app.use('/test', async(req, res) => {
	const spotify = new SpotifyWebApi({
		clientId: process.env.SPOTIFYID,
		clientSecret: process.env.SPOTIFYSECRET,
	});
	
	let auth:any;
	try{
		auth = await spotify.clientCredentialsGrant();
		spotify.setAccessToken(auth.body['access_token']);
	} catch(e){
		console.error(e);
	}
	
	res.status(201).json(auth.body).send();
});


app.get('/discogsAuth', function(req, res){
	const oAuth = new disco.Client().oauth();
	console.log('getting auth')
	oAuth.getRequestToken(
		discogsKey, discogsSecret,'http://localhost:8000/discogsAuthCallback', 
		function(err:any, requestData){
			if(err) {
				res.status(500).send('oauth issue');
			}
			//persist in Express instance
			req.app.locals.requestData = requestData;
			res.redirect(requestData.authorizeUrl);
		}
	);
});

app.get('/discogsAuthCallback', (req, res) => {
	const requestData = req.app.locals.requestData;
	const oAuth = new disco.Client(requestData).oauth();
	oAuth.getAccessToken(
		req.query.oauth_verifier as string, //code sent back by Discogs
		function(err, accessData){
			//THIS SHOULD BE STORED PER USER ON THEIR BEHALF AND CAN BE KEPT FOREVER
			console.log('got access!', accessData)
			//persist in Express instance
			req.app.locals.DiscogsAccess = accessData;
			res.status(200).send('Received access token!');
		}
	);
});

app.get('/authedAPI', async(req, res)=>{
	console.log('\nAUTHED CALLS\n\n')
	const tempCreds = { //TODO
		method: 'oauth',
		level: 2,
		consumerKey: 'mfaXvmquWsNFQJSmTqye',
		consumerSecret: 'JaCzXhLzIQMQMUSwCdzLbNbKTzHhphfy',
		token: 'NAuQyQaqTIOSrdcyaWkPhEIdkmzWAXbmNzMHwAfa',
		tokenSecret: 'uQpgByqEhCmqCmkCUQkGEMqRcOPrROYSHydJLaGs'
	}
	const discogs:Client = new disco.Client(tempCreds);
	//const discogs:Client = new disco.Client(app.locals.DiscogsAccess);

	res.send(await _apiTests(discogs));
});


const MYUSER:string = 'classicalonvinyl';
const OTHERUSER:string = 'KingKubrick';
const FORSALEUSER:string = 'Colonia.Records';

app.get('/publicAPI', async(req, res)=>{
	console.log('\nNON-AUTHED CALLS\n\n')
	const discogs:Client = new disco.Client({
		consumerKey:discogsKey,
		consumerSecret:discogsSecret
	});
	const discogsDb:Database = discogs.database();

	res.send(await _apiTests(discogs));
});

async function _apiTests(discogs:Client){
	let data = [];
	//any user's public collection, no auth required
	const discogsUser = discogs.user();
	//let {releases} = await discogsUser.collection().getReleases(MYUSER, 0);
	//console.log(releases.length)
	//let {releases:rel2} = await discogsUser.collection().getReleases(OTHERUSER, 0);
	//console.log(rel2.length)
	
	//const {lists} = await discogsUser.getLists(MYUSER);
	//console.log(lists.length)
	//const {lists:l2} = await discogsUser.getLists(OTHERUSER);
	//console.log(l2.length)
	

	//authed calls can get ALL inventory for current user including drafts and sold
	const params:disco.GetInventoryParams = {status:'for sale'};
	const {pagination} = await discogsUser.getInventory(MYUSER, params);
	console.log(pagination.items);
	const {pagination:p2} = await discogsUser.getInventory(FORSALEUSER, params);
	console.log(p2.items);
	data.push(pagination.items, p2.items)
	
	
	//any user's public list, no auth required
	//const opt:discogs.PaginationOpts = {}
	//const res = await discogsUser.getLists(OTHERUSER, opt)
	
	return data;
}

		//any user's public wantlist, no auth required
		//const res = await discogsUser.wantlist().getReleases(USER);
		
		//no auth required
		//const res = await discogsDb.getRelease(176126);
		//console.log(res)
		
