exports.contactUsEmail = function(request, response, sgMail) {
  const msg = {
    to: "contactus.butterflyremotejobs@gmail.com",
    from: request.body.email,
    subject: `Contact Us Form: ${request.body.subject}`,
    text: `From ${request.body.fullName}. Message: ${request.body.message}`
    // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

    // custom templates
    //     templateId: '300e1045-5b30-4f15-8c43-41754b73fe4f',
    //     substitutionWrappers: ['{{', '}}'],
    //     substitutions: {
    //       name: toName
    //       // and other custom properties here
    //     }
  };

  return sgMail
    .send(msg)
    .then(() => response.status(200).send({ success: true }))
    .catch(error =>
      response.status(400).response.send({ data: error, success: false })
    );
};
