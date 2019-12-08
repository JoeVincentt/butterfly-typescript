exports.stripePayment = function(request, response, stripe) {
  //   console.log(request.body);
  stripe.charges
    .create({
      amount: request.body.amount * 100,
      currency: "usd",
      source: request.body.token,
      description: `Charge for ${request.body.email}. Company ${request.body.companyName}`,
      receipt_email: request.body.email,
      metadata: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        companyName: request.body.companyName
      }
    })
    .then(charge => {
      console.log(charge);
      return response.send({ data: charge, success: true });
    })
    .catch(error => {
      console.log(error);
      return response.send({ data: error, success: false });
    });
};
