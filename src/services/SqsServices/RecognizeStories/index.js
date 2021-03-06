const sgMail = require("@sendgrid/mail");
const AWS = require("aws-sdk");
const Story = require("../../../models/story");
const logs = require("../../../logs");
const { RejectStory, ApproveStory } = require("../../../templates");

AWS.config.update({ region: "us-east-2" });
const rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });

sgMail.setApiKey(process.env.SENDGRID_KEY);

const reasonsTranslated = {
  "Explicit Nudity": "Nudez Explicita",
  Nudity: "Nudez",
  Suggestive: "Conteudo sugestivo",
  "Revealing Clothes": "Roupas inadequeadas",
  "Nazi Party": "Simbolos extremistas",
  "Hate Symbols": "Simbolos extremistas",
  Gambling: "Jogos de azar",
  Smoking: "Tabaco ou fumo",
  Tobacco: "Tabaco ou fumo",
  "Rude Gestures": "Gestos Rudes",
  "Graphic Violence Or Gore": "Sangue ou violencia",
  Violence: "Violencia",
};

async function RecognizeStories(datas) {
  for (const dataQeue of datas) {
    const params = {
      Image: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET,
          Name: dataQeue.imageKey,
        },
      },
    };

    rekognition.detectModerationLabels(params, async function (err, data) {
      if (err) {
        sendLogError({ data: err, name: "QUEUE_STORY_ERRR" });
        return console.log({ data: err, name: "QUEUE_STORY_ERRR" });
      }
      logs.info("SUCCESSFULL_STORY_ANALISIED");

      try {
        const reasons = [];
        if (data.ModerationLabels.length) {
          for (const { Name } of data.ModerationLabels) {
            if (reasonsTranslated[Name]) reasons.push(reasonsTranslated[Name]);
          }

          const story = await Story.findById(dataQeue.storyId);

          if (!story) return;

          story.status = "rejected";

          await story.save();

          const msg = {
            to: dataQeue.email,
            from: process.env.EMAIL,
            subject: `FoodZilla Seu Story foi Rejeitado`,
            text: "FoodZilla",
            html: RejectStory({
              image:
                dataQeue.image.replace(
                  "s3.us-east-2.amazonaws.com",
                  "imgix.net"
                ) + "?blur=100",
              reasons,
            }),
          };
          sgMail
            .send(msg)
            .catch((error) =>
              logs.error(`Error in send email${error.response.body}`)
            );
        } else {
          const msg = {
            to: dataQeue.email,
            from: process.env.EMAIL,
            subject: `FoodZilla Seu Story foi Aprovado`,
            text: "FoodZilla",
            html: ApproveStory({ image: dataQeue.image }),
          };
          sgMail
            .send(msg)
            .catch((error) =>
              logs.error(`Error in send email ${error.response.body}`)
            );

          const story = await Story.findById(dataQeue.storyId);

          if (!story) return;

          story.approved = true;
          story.status = "approved";

          await story.save();
        }
      } catch (error) {
        sendLogError({ data: error, name: "QUEUE_STORY_ERRR" });
        return console.log({ data: error, name: "QUEUE_STORY_ERRR" });
      }
    });
  }
}

module.exports = RecognizeStories;
