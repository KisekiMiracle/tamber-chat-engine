// backend/utils/email.ts
import mjml2html from "mjml";
import { Resend } from "resend";
import { html } from "../template-strings";

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeParams {
  name: string;
  loginUrl: string;
}

export const sendWelcomeEmail = async (
  to: string,
  { name, loginUrl }: WelcomeParams,
) => {
  const mjmlTemplate = html`
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Helvetica, Arial, sans-serif" />
          <mj-text font-size="16px" color="#333" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#f4f4f4">
        <mj-section background-color="#ffffff" padding="20px">
          <mj-column>
            <mj-text font-weight="bold" font-size="24px">
              Welcome aboard, ${name}!
            </mj-text>
            <mj-text>
              We're excited to have you in the Tamber Engine. Ready to start
              chatting?
            </mj-text>
            <mj-button background-color="#000" color="white" href="${loginUrl}">
              Enter the App
            </mj-button>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const { html: renderedHtml, errors = [] } = await (mjml2html(
    mjmlTemplate,
  ) as any);

  if (errors && errors.length > 0) {
    console.error("MJML Parse Errors:", errors);
  }

  return await resend.emails.send({
    from: "Tamber Engine <noreply@info.kiseki-miracle.dev>",
    to: [to],
    subject: "Welcome to Tamber Engine",
    html: renderedHtml,
  });
};
