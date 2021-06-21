const Algorithmia = require("algorithmia");
const sgMail = require("@sendgrid/mail");
const Story = require("../../../models/story");
sgMail.setApiKey(process.env.SENDGRID_KEY);

async function RecognizeStories(datas) {
  console.log("called");
  console.log(datas);
  for (const data of datas) {
    Algorithmia.client("simvJSYjheHpgasp7CePA4kWU3x1")
      .algo("sfw/NudityDetectioni2v/0.2.13?timeout=300") // timeout is optional
      .pipe(data.image)
      .then(async (response) => {
        if (response.get().nude === "true") {
          console.log("contem nudez");

          const msg = {
            to: data.email,
            from: process.env.EMAIL,
            subject: `FoodZilla Seu Story foi Rejeitado`,
            text: "FoodZilla",
            html: `
              <p>Story contem nudez ${data.image}</p>
            `,
          };
          sgMail
            .send(msg)
            .then(
              () => {},
              (error) => {
                console.error(error);

                if (error.response) {
                  console.error(error.response.body);
                }
              }
            )
            .catch((error) => console.log(error));
        } else {
          console.log("não contem nudez");
          const msg = {
            to: data.email,
            from: process.env.EMAIL,
            subject: `FoodZilla Seu Story foi Aprovado`,
            text: "FoodZilla",
            html: `
              <p>Story aprovado ${data.image}</p>
            `,
          };
          sgMail
            .send(msg)
            .then(
              () => {},
              (error) => {
                console.error(error);

                if (error.response) {
                  console.error(error.response.body);
                }
              }
            )
            .catch((error) => console.log(error));

          const story = await Story.findById(data.storyId);

          story.approved = true;

          await story.save();
        }
      });
  }
}

module.exports = { RecognizeStories };
