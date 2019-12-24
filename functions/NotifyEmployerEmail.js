exports.notifyEmployerEmail = async function(request, response, sgMail, admin) {
  const db = admin.firestore();
  const data = request.body;

  try {
    const document = await db
      .collection("users")
      .doc(data.postedBy)
      .get();
    const { email } = document.data();
    const msg = {
      to: email,
      from: "no-reply@butterflyremote.com",
      subject: `New Applicant: ${data.firstName} ${data.lastName} applied for ${data.jobTitle}`,
      text: `New Applicant ${data.firstName}  ${data.lastName}. Position: ${data.jobTitle}. Applicant email: ${data.email}`
    };
    await sgMail.send(msg);
    return response.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(400).response.send({ data: error, success: false });
  }

  // const msg = {
  //   to: "contactus.butterflyremotejobs@gmail.com",
  //   from: request.body.email,
  //   subject: `Contact Us Form: ${request.body.subject}`,
  //   text: `From ${request.body.fullName}. Message: ${request.body.message}`
  //   // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

  //   // custom templates
  //   //     templateId: '300e1045-5b30-4f15-8c43-41754b73fe4f',
  //   //     substitutionWrappers: ['{{', '}}'],
  //   //     substitutions: {
  //   //       name: toName
  //   //       // and other custom properties here
  //   //     }
  // };

  //   return sgMail
  //     .send(msg)
  //     .then(() => response.status(200).send({ success: true }))
  //     .catch(error =>
  //       response.status(400).response.send({ data: error, success: false })
  //     );
};
