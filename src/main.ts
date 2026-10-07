import LemmyBot, {
  ApproveRegistrationApplication,
  BotCredentials,
} from "lemmy-bot";
import "dotenv/config";

const instance = "lemmy.ml";
const credentials: BotCredentials = {
  username: process.env.USERNAME!,
  password: process.env.PASSWORD!,
};

const invalidSequences = [
  "48",
  "Hi! I'm a developer interested in decentralized platforms.",
  "I am an AI",
  "AI agent",
];

const invalidEmails = ["ilands.com"];
const invalidCreatorNames = [""];

const dbFile = "bot.sqlite";

const bot = new LemmyBot({
  instance,
  credentials,
  dbFile,
  connection: {
    secondsBetweenPolls: 300,
  },
  markAsBot: false,
  handlers: {
    registrationApplication: res => {
      // The important fields
      const id = res.applicationView.registration_application.id;
      const email = res.applicationView.creator_local_user.email;
      const answer = res.applicationView.registration_application.answer;
      const name = res.applicationView.creator.name;

      console.log(`Processing application #${id}\n`);
      console.log(`name: ${name}\nemail: ${email}\nanswer:\n${answer}\n`);
      // console.log(JSON.stringify(res.applicationView, null, 2));

      // A generic deny form
      let denyForm: ApproveRegistrationApplication = {
        id,
        approve: false,
      };

      // Deny empty answers
      if (answer.trim().length === 0) {
        denyForm.deny_reason = "Answer was empty.";
      }

      // Deny any of the invalid sequences
      else if (
        invalidSequences.some(sequence =>
          answer.toLowerCase().includes(sequence.toLowerCase()),
        )
      ) {
        denyForm.deny_reason = "Answer contained an invalid sequence.";
      }

      // Deny any of the invalid emails
      else if (
        invalidEmails.some(sequence =>
          email?.toLowerCase().includes(sequence.toLowerCase()),
        )
      ) {
        denyForm.deny_reason = "Invalid email.";
      }
      // Deny any of the invalid names
      else if (
        invalidCreatorNames.some(sequence =>
          name.toLowerCase().includes(sequence.toLowerCase()),
        )
      ) {
        denyForm.deny_reason = "Invalid name.";
      }

      // If you've provided a deny reason, then log it and deny
      if (denyForm.deny_reason) {
        console.log(`Denying application because: ${denyForm.deny_reason}`);
        res.botActions.approveRegistrationApplication(denyForm);
      } else {
        console.log("No action taken");
      }

      console.log("\n---\n");
    },
  },
});

bot.start();
