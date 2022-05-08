import { MiddlewareFunction } from "@internal/schema/dist/wrappers/rest-endpoint";
import { Database } from "@internal/database/dist";

const authenticationMiddleware: MiddlewareFunction = async (req, res) => {
	const { body, headers, params } = req;
	const { authentication } = headers;

	if (authentication === undefined || typeof authentication !== "string") {
		res.status(401).json({
			error: "Authentication header is missing or invalid"
		});
		return;
	}

	const [authType, authToken] = authentication.split(" ");
	
	if (authType === "Bearer") {
		//TODO: JWT
	} else if (authType === "ApiKey") {
		const apiKeyRecord = await Database.userApiKey.getByApiKey(authToken);
		if(apiKeyRecord === null) {
			res.status(401).json({
				error: "Unauthorized"
			});
			return;
		}

		const userRecord = await Database.user.getById(apiKeyRecord.userId);
		if(userRecord === null) {
			res.status(500).json({
				error: "User not found for this api key. This should never happen."
			});
			return;
		}

		res.locals.apiKey = apiKeyRecord;
		res.locals.user = userRecord;
	} else {
		res.status(401).json({
			error: "Malformed authorization header"
		});
		return;
	}
}