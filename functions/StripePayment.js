exports.stripePayment = async function(request, response, stripe, admin) {
  const db = admin.firestore();
  const data = request.body;
  let price;
  console.log(request.body);
  //add additional check for job posting
  const marathonPrice = 239;
  const midrangePrice = 179;
  const sprintPrice = 99;
  if (
    data.advertisementPlan === "Marathon" ||
    data.advertisementPlan === "Sprint" ||
    data.advertisementPlan === "Mid-range"
  ) {
    if (data.promoCode !== "") {
      //if promo code applied
      try {
        const document = await db
          .collection("coupons")
          .doc(data.promoCode)
          .get();
        if (document.exists) {
          const coupon = document.data();
          if (coupon.expiration < Date.now() + 3600000) {
            //expired
            console.log("Coupon Is Expired");
            return proceedCharge();
          } else {
            //valid
            setPriceByPlan();
            price = (price - (price * coupon.discount) / 100).toFixed(2);
            if (price === data.amount) {
              //the right price was passed by client
              return proceedCharge();
            } else {
              //wrong data was passed by client
              console.log("Wrong Price Data Was Passed By Client");
              return response.send({ success: false });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      //NO promo code
      setPriceByPlan();
      if (price === data.amount) {
        //the right price was passed by client
        return proceedCharge();
      } else {
        //wrong data was passed by client
        console.log("Wrong Price Data Was Passed By Client");
        return response.send({ success: false });
      }
    }
  } else {
    console.log("Wrong Advertisement Plan Was Passed By Client");
    return response.send({ success: false });
  }

  function setPriceByPlan() {
    if (data.advertisementPlan === "Marathon") {
      price = marathonPrice;
    }
    if (data.advertisementPlan === "Sprint") {
      price = sprintPrice;
    }
    if (data.advertisementPlan === "Mid-range") {
      price = midrangePrice;
    }
  }

  async function proceedCharge() {
    try {
      const charge = await stripe.charges.create({
        amount: data.amount * 100,
        currency: "usd",
        source: data.token,
        description: `Charge for ${data.email}. Company ${data.companyName}`,
        receipt_email: data.email,
        metadata: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          companyName: data.companyName,
          advertisementPlan: data.advertisementPlan,
          promoCode: data.promoCode
        }
      });
      console.log("Stripe Payment Charge", charge);
      return response.send({ data: charge, success: true });
    } catch (error) {
      console.log("Stripe Payment Error:", error);
      return response.send({ data: error, success: false });
    }
  }
};
