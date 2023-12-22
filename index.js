const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())

app.get('/install', async function(req, res) {
	try {
		const shop = req.query.shop
		const url = new URL(`https://${shop}`)
		url.pathname = 'admin/oauth/authorize'
		url.search = new URLSearchParams({
			client_id: process.env.API_KEY,
			scope: process.env.SCOPES,
			redirect_uri: process.env.REDIRECT
			}).toString()

		res.redirect(url.toString())
	} catch(e) {
		console.log(e)
	}
})

app.get('/token', async function(req, res) {
	try {
		const shop = req.query.shop
		const code = req.query.code
		if (!shop || !code) {
			res.end()
			throw new Error('Shop or code not found')
		}

		const postObj = {
			client_id: process.env.API_KEY,
			client_secret: process.env.API_SECRET,
			code
		}

		const r = await fetch(`https://${shop}/admin/oauth/access_token`, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(postObj)
		})
		const d = await r.json()
		console.log(d)
	} catch (e) {
		console.log(e)
	}
})

app.listen('9000')
