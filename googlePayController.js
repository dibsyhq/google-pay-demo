import axios from "axios";

export const processGooglePayToken = async (req, res) => {
	try {
		const { paymentMethodData } = req.body;

		const options = {
			method: "googlepay",
			amount: {
				value: "1.00",
				currency: "QAR",
			},
			description: "Order #1337",
			googlePayToken: JSON.stringify(paymentMethodData),
			redirectUrl: "https://example.com",
			metadata: {
				order: 1337,
			},
		};

		const response = await axios.post(
			"https://api.dibsy.one/v2/payments",
			options,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.DIBSY_API_SK}`,
				},
			}
		);

		console.log("Printing Response");
		console.log(response.data);
		res.sendStatus(200);
	} catch (error) {
		console.log("Printing Error");
		console.log(error);
	}
};
