// VERSION
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
};

const baseCardPaymentMethod = {
  type: "CARD",
  parameters: {
    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
    allowedCardNetworks: ["MASTERCARD", "VISA"],
  },
};

const tokenizationSpecification = {
  type: "PAYMENT_GATEWAY",
  parameters: {
    gateway: env.GATEWAY,
    gatewayMerchantId: env.GATEWAY_MERCHANT_ID,
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
    merchantId: env.MERCHANT_ID,
    merchantName: env.MERCHANT_NAME,
  };
  return paymentDataRequest;
}

function getGooglePaymentsClient() {
  if (paymentsClient === null) {
    paymentsClient = new google.payments.api.PaymentsClient({
      environment: env.ENVIRONMENT,
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
      return processPayment(paymentData);
    })
    .then(function (result) {
      console.log(result);
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
  }).then((res) => res.json());
  return response;
}
