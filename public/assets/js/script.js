// VERSION
const baseRequest = {
	apiVersion: 2,
	apiVersionMinor: 0,
};

const baseCardPaymentMethod = {
	type: "CARD",
	parameters: {
		allowedAuthMethods: ["CRYPTOGRAM_3DS"],
		allowedCardNetworks: ["MASTERCARD", "VISA"],
	},
};

const tokenizationSpecification = {
	type: "PAYMENT_GATEWAY",
	parameters: {
		gateway: "verygoodsecurity",
		gatewayMerchantId: "ACkXpaU1qFuSz9ukJaAqjzg5",
	},
};

const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
	tokenizationSpecification: tokenizationSpecification,
});

let paymentsClient = null;

function getGoogleIsReadyToPayRequest() {
	return Object.assign({}, baseRequest, {
		allowedPaymentMethods: [baseCardPaymentMethod],
	});
}

function getGooglePaymentDataRequest() {
	const paymentDataRequest = Object.assign({}, baseRequest);
	paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
	paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
	paymentDataRequest.merchantInfo = {
		merchantId: "BCR2DN4TRTFIBKQB",
		merchantName: "Rose and Rose",
	};
	return paymentDataRequest;
}

function getGooglePaymentsClient() {
	if (paymentsClient === null) {
		paymentsClient = new google.payments.api.PaymentsClient({
			environment: "PRODUCTION",
		});
	}
	return paymentsClient;
}

function onGooglePayLoaded() {
	const paymentsClient = getGooglePaymentsClient();
	paymentsClient
		.isReadyToPay(getGoogleIsReadyToPayRequest())
		.then(function (response) {
			if (response.result) {
				addGooglePayButton();
			}
		})
		.catch(function (err) {
			console.error(err);
		});
}

function addGooglePayButton() {
	const paymentsClient = getGooglePaymentsClient();
	const button = paymentsClient.createButton({
		onClick: onGooglePaymentButtonClicked,
	});
	document.getElementById("container").appendChild(button);
}

function getGoogleTransactionInfo() {
	return {
		countryCode: "QA",
		currencyCode: "QAR",
		totalPriceStatus: "FINAL",
		totalPrice: "1.00",
	};
}

function prefetchGooglePaymentData() {
	const paymentDataRequest = getGooglePaymentDataRequest();
	paymentDataRequest.transactionInfo = {
		totalPriceStatus: "NOT_CURRENTLY_KNOWN",
		currencyCode: "QAR",
	};
	const paymentsClient = getGooglePaymentsClient();
	paymentsClient.prefetchPaymentData(paymentDataRequest);
}

function onGooglePaymentButtonClicked() {
	const paymentDataRequest = getGooglePaymentDataRequest();
	paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

	const paymentsClient = getGooglePaymentsClient();
	paymentsClient
		.loadPaymentData(paymentDataRequest)
		.then(function (paymentData) {
			processPayment(paymentData);
		})
		.catch(function (err) {
			console.error(err);
		});
}

async function processPayment(paymentData) {
	console.log(paymentData);
	const response = await fetch("/payments/googlepay/tokens", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(paymentData),
	});
}
