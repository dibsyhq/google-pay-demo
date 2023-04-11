# Sample Integration for Google Pay using Dibsy API

This is a sample integration for Google Pay using Dibsy API. It is an Express server application that listens for Google Pay token requests and processes them using the Dibsy API. For more details, refer to official documentation [here](https://dibsy.dev/docs/google-pay/overview).

## Prerequisites

Before using this sample integration, you need to have the following:

1. A Dibsy account
2. Dibsy API Secret Key
3. A Google Pay account

## Installation

To use this sample integration, follow these steps:
Clone this repository
Run npm install to install the dependencies
Create a .env file and add the following variables:

```shell
PORT=4545
DIBSY_API_SK=<your-dibsy-api-secret-key>
```

Start the server by running npm start

## Usage

The Google Pay payload to Dibsy API must be stringified in the below format.

```json
{
	"paymentMethodData": {
		"description": "Payment method generated from Google Pay.",
		"tokenizationData": {
			"type": "PAYMENT_GATEWAY",
			"token": "..."
		},
		"type": "CARD",
		"info": { "cardNetwork": "VISA", "cardDetails": "0024" }
	}
}
```

## License

This sample integration is licensed under the MIT License. You are free to use, modify, and distribute this sample integration as long as you include the original license file.
