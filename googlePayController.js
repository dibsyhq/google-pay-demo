import axios from "axios";
const API = process.env.DIBSY_API ?? 'https://api.dibsy.one/v2/payments'
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
		console.log('Sending Request to Dibsy ....');
		const response = await axios.post(
			`${API}/v2/payments`,
			options,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.DIBSY_API_SK}`,
				},
			}
		);

		console.log("Printing Response");
		const data = response.data;
		console.log(data);
		return res.status(200).json(data);
	} catch (error) {
		if (error.response?.data) {
			const { status, data } = error.response
			console.log(data);
			return res.status(status).json(data)
		}
		console.log("Printing Error");
		console.log(error);
	}
	finally {
		console.log('Request completed');
	}
};
